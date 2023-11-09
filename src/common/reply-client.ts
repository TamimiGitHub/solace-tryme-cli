import solace from "solclientjs";
import { Logger } from '../utils/logger'
import { LogLevel } from "solclientjs";
import { defaultMessage, getDefaultTopic } from "../utils/defaults";
const os = require('os');

const logLevelMap:Map<string, LogLevel> = new Map<string, LogLevel>([
  ['FATAL', LogLevel.FATAL],
  ['ERROR', LogLevel.ERROR],
  ['WARN', LogLevel.WARN],
  ['INFO', LogLevel.INFO],
  ['DEBUG', LogLevel.DEBUG],
  ['TRACE', LogLevel.TRACE]
]);

export class ReplyClient {
  //Solace session object
  options:any = null;
  replier:any = {};
  session:any = null;

  constructor(options:any) {
    // record the options
    this.options = options;
    this.replier.subscribed = [];

    //Initializing the solace client library
    let factoryProps = new solace.SolclientFactoryProperties();
    factoryProps.profile = solace.SolclientFactoryProfiles.version10;
    solace.SolclientFactory.init(factoryProps);
    this.options.logLevel && solace.SolclientFactory.setLogLevel(logLevelMap.get(this.options.logLevel.toUpperCase()) as LogLevel);
  }

  // Establishes connection to Solace PubSub+ Event Broker
  async connect() {
    return new Promise<void>((resolve, reject) => {
      if (this.session !== null) {
        Logger.logWarn('already connected and ready to receive requests.');
        return;
      }

      try {
        this.session = solace.SolclientFactory.createSession({
          url: this.options.url,
          vpnName: this.options.vpn,
          userName: this.options.username,
          password: this.options.password,
          clientName: this.options.clientName,
          applicationDescription: this.options.description,
          connectTimeoutInMsecs: this.options.connectionTimeout,
          connectRetries: this.options.connectionRetries,
          reconnectRetries: this.options.reconnectRetries,
          reconnectRetryWaitInMsecs: this.options.reconnectRetryWait,
          readTimeoutInMsecs: this.options.readTimeout,
          generateSendTimestamps: this.options.sendTimestamps,
          generateReceiveTimestamps: this.options.receiveTimestamps,
          includeSenderId: this.options.includeSenderId,
          generateSequenceNumber: this.options.generateSequenceNumber,
          keepAliveIntervalInMsecs: this.options.keepAlive,
          keepAliveIntervalsLimit: this.options.keepAliveIntervalLimit,
          reapplySubscriptions: this.options.reapplySubscriptions,
          sendBufferMaxSize: this.options.sendBufferMaxSize,
        });

        // define session event listeners
        this.session.on(solace.SessionEventCode.UP_NOTICE, (sessionEvent: solace.SessionEvent) => {
          Logger.logSuccess('=== successfully connected and ready to subscribe to request topic. ===');
          resolve();
        });
        this.session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, (sessionEvent: solace.SessionEvent) => {
          Logger.logDetailedError(`connection failed to the message router ${sessionEvent.infoStr} - `, `check the connection parameters!`),
          reject();
        });
        this.session.on(solace.SessionEventCode.DISCONNECTED, (sessionEvent: solace.SessionEvent) => {
          Logger.logSuccess('disconnected.');
          this.replier.subscribed = false;
          if (this.session !== null) {
            this.session.dispose();
            this.session = null;
          }
        });
        this.session.on(solace.SessionEventCode.SUBSCRIPTION_ERROR, (sessionEvent: solace.SessionEvent) => {
          Logger.logDetailedError(`cannot subscribe to topic ${sessionEvent.correlationKey} - `, sessionEvent.infoStr)
        });
        this.session.on(solace.SessionEventCode.SUBSCRIPTION_OK, (sessionEvent: solace.SessionEvent) => {
          if (this.replier.subscribed.includes(sessionEvent.correlationKey)) {
            this.replier.subscribed.splice(this.replier.subscribed.indexOf(sessionEvent.correlationKey), 1)
            Logger.logSuccess('successfully unsubscribed from request topic: ' + sessionEvent.correlationKey);
          } else {
            this.replier.subscribed.push(sessionEvent.correlationKey)
            Logger.logSuccess('successfully subscribed to request topic: ' + sessionEvent.correlationKey);
            Logger.await('=== ready to receive requests. ===');
          }
        });
        // define message event listener
        this.session.on(solace.SessionEventCode.MESSAGE, (message: any) => {
          try {
            var request:any = message as string;
            var payload = request.getDestination().getName() === getDefaultTopic('request') ? defaultMessage : JSON.parse(request.getBinaryAttachment());
            payload.hasOwnProperty('osType') ? payload.osType = os.type() : ''
            payload.hasOwnProperty('freeMem') ? payload.freeMem = os.freemem() : ''
            payload.hasOwnProperty('totalMem') ? payload.totalMem = os.totalmem() : ''
            payload.hasOwnProperty('timeZone') ? payload.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone : ''
          
            this.reply(request, payload);
          } catch (error:any) {
            Logger.logDetailedError('send reply failed - ', error.toString())
            if (error.cause?.message) Logger.logDetailedError(``, `${error.cause?.message}`)
          }
        });
      } catch (error:any) {
        Logger.logDetailedError('session creation failed - ', error.toString())
        if (error.cause?.message) Logger.logDetailedError(``, `${error.cause?.message}`)
      }

      // connect the session
      try {
        Logger.await(`connecting to broker [${this.options.url}, vpn: ${this.options.vpn}, username: ${this.options.username}${this.options.clientName ? `, password: ${this.options.password}` : ''}]`)
        if (this.options.clientName) Logger.info(`client name: ${this.options.clientName}`)
        this.session.connect();
      } catch (error:any) {
        Logger.logDetailedError('failed to connect to broker - ', error.toString())
        if (error.cause?.message) Logger.logDetailedError(``, `${error.cause?.message}`)
      }
    });
  }

  // Subscribes to request topic on Solace PubSub+ Event Broker
  subscribe = (topicNames: any) => {
    //Check if the session has been established
    if (!this.session) {
      Logger.logWarn("cannot subscribe because not connected to Solace message router!");
      return;
    }

    try {
      topicNames.forEach((topicName:any) => {
        Logger.logInfo(`subscribing to ${topicName}`);
  
        //Session subscription
        this.session.subscribe(
          solace.SolclientFactory.createTopicDestination(topicName),
          true, // generate confirmation when subscription is added successfully
          topicName, // use topic name as correlation key
          this.options.readTimeout ? this.options.readTimeout : 10000 // 10 seconds timeout for this operation, if not specified
        );                
      });
    } catch (error: any) {
      Logger.logDetailedError(`subscribe action failed - `, error.toString())
      if (error.cause?.message) Logger.logDetailedError(``, `${error.cause?.message}`)
    }

  };

  // Unsubscribes from request topic on Solace PubSub+ Event Broker
  unsubscribe = () => {
    if (this.session !== null) {
      this.replier.subscribed.forEach((topicName:any) => {
        Logger.logInfo('unsubscribing from topic: ' + topicName);
        try {
          this.session.unsubscribe(
            solace.SolclientFactory.createTopicDestination(this.replier.topicName),
            true, // generate confirmation when subscription is removed successfully
            topicName, // use topic name as correlation key
            10000 // 10 seconds timeout for this operation
          );
        } catch (error:any) {
          Logger.logDetailedError(`failed to unsubscribe to topic ${topicName} - `, error.toString())
          if (error.cause?.message) Logger.logDetailedError(``, `${error.cause?.message}`)
        }
      })
    } else {
      Logger.logError('cannot unsubscribe because not connected to Solace PubSub+ Event Broker.');
    }
  };

  reply = (message:any, payload:any) => {
    Logger.logSuccess('request received');
    Logger.printMessage(message.dump(0), message.getUserPropertyMap(), message.getBinaryAttachment(), this.options.pretty);
    Logger.await(`replying to request on topic '${message.getDestination().getName()}'...`);
    if (this.session !== null) {
      var reply = solace.SolclientFactory.createMessage();
      reply.setBinaryAttachment(JSON.stringify(payload));
      this.session.sendReply(message, reply);
      Logger.logSuccess('replied.');
    } else {
      Logger.logError('cannot reply because not connected to Solace PubSub+ Event Broker.');
    }
  };

  // Gracefully disconnects from Solace PubSub+ Event Broker
  disconnect = () => {
    Logger.logSuccess('disconnecting from Solace PubSub+ Event Broker...');
    if (this.session !== null) {
      try {
        this.session.disconnect();
      } catch (error:any) {
        Logger.logDetailedError('session disconnect failed - ', error.toString())
        if (error.cause?.message) Logger.logDetailedError(``, `${error.cause?.message}`)
      }
    } else {
      Logger.logError('not connected to Solace PubSub+ Event Broker.');
    }
  };

  exit = () => {
    this.unsubscribe();
    setTimeout(() => {
      this.disconnect();
    }, 1000); // wait for 1 second to disconnect
    setTimeout(function () {
      Logger.logSuccess('exiting...')
      process.exit(0);
    }, 2000); // wait for 2 seconds to finish
  };
}
