import solace, { LogLevel, MessageDeliveryModeType } from "solclientjs";
import { Logger } from '../utils/logger'
import { getDefaultClientName, getDefaultTopic } from "../utils/defaults";
import { VisualizeClient } from "./visualize-client";
import { STM_CLIENT_CONNECTED, STM_CLIENT_DISCONNECTED, STM_EVENT_REQUESTED, STM_EVENT_REPLY_RECEIVED } from "../utils/controlevents";
import { randomUUID } from "crypto";
const { uuid } = require('uuidv4');

const logLevelMap:Map<string, LogLevel> = new Map<string, LogLevel>([
  ['FATAL', LogLevel.FATAL],
  ['ERROR', LogLevel.ERROR],
  ['WARN', LogLevel.WARN],
  ['INFO', LogLevel.INFO],
  ['DEBUG', LogLevel.DEBUG],
  ['TRACE', LogLevel.TRACE]
]);

const deliveryModeMap:Map<string, MessageDeliveryModeType> = new Map<string, MessageDeliveryModeType>([
  ['DIRECT', MessageDeliveryModeType.DIRECT],
  ['PERSISTENT', MessageDeliveryModeType.PERSISTENT],
  ['NON_PERSISTENT', MessageDeliveryModeType.NON_PERSISTENT],
]);
export class SolaceClient extends VisualizeClient {
  //Solace session object
  options:any = null;
  callback:any = null;
  requestor:any = {};
  session:any = null;
  clientName:string = ""

  constructor(options:any) {
    super();

    // record the options
    this.options = options;
    this.requestor.topicName = this.options.topic ? this.options.topic : getDefaultTopic('request');

    //Initializing the solace client library
    let factoryProps = new solace.SolclientFactoryProperties();
    factoryProps.profile = solace.SolclientFactoryProfiles.version10;
    solace.SolclientFactory.init(factoryProps);
    this.options.logLevel && solace.SolclientFactory.setLogLevel(logLevelMap.get(this.options.logLevel.toUpperCase()) as LogLevel);
    this.clientName = this.options.clientName ? this.options.clientName : getDefaultClientName('req')
  }

  // Establishes connection to Solace PubSub+ Event Broker
  async connect() {
    return new Promise<void>((resolve, reject) => {
      if (this.session !== null) {
        Logger.logWarn("already connected and ready to send requests.");
        return;
      }

      try {
        this.session = solace.SolclientFactory.createSession({
          url: this.options.url,
          vpnName: this.options.vpn,
          userName: this.options.username,
          password: this.options.password,
          clientName: this.clientName,
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
          Logger.logSuccess('=== ' + this.clientName + ' successfully connected and ready to send requests. ===');
          this.publishVisualizationEvent(this.session, this.options, STM_CLIENT_CONNECTED, { 
            type: 'requestor', clientName: this.clientName, uuid: uuid()
          })    
          resolve();
        });
        this.session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, (sessionEvent: solace.SessionEvent) => {
          Logger.logDetailedError(`connection failed to the message router ${sessionEvent.infoStr} - `, `check the connection parameters!`),
          reject();
        });
        this.session.on(solace.SessionEventCode.DISCONNECTED, (sessionEvent: solace.SessionEvent) => {
          Logger.logSuccess('disconnected.');
          this.requestor.subscribed = false;
          if (this.session !== null) {
            this.session.dispose();
            this.session = null;
          }
        });
      } catch (error:any) {
        Logger.logDetailedError('session creation failed - ', error.toString())
        if (error.cause?.message) Logger.logDetailedError(``, `${error.cause?.message}`)
      }

      // connect the session
      try {
        Logger.await(`connecting to broker [${this.options.url}, vpn: ${this.options.vpn}, username: ${this.options.username}, password: ******]`)
        if (this.options.clientName) Logger.info(`client name: ${this.options.clientName}`)
        this.session.connect();
      } catch (error:any) {
        Logger.logDetailedError('failed to connect to broker - ', error.toString())
        if (error.cause?.message) Logger.logDetailedError(``, `${error.cause?.message}`)
      }

    });
  }

  // sends one request
  request = (topicName: string, payload: string | Buffer) => {
    if (!this.session) {
      Logger.logWarn("cannot subscribe because not connected to Solace message router!");
      return;
    }
    
    Logger.await('requesting...');
    var request = solace.SolclientFactory.createMessage();
    request.setDestination(solace.SolclientFactory.createTopicDestination(topicName));
    request.setBinaryAttachment(JSON.stringify(payload));
    this.options.deliveryMode && request.setDeliveryMode(deliveryModeMap.get(this.options.deliveryMode.toUpperCase()) as MessageDeliveryModeType);
    this.options.timeToLive && request.setTimeToLive(this.options.timeToLive);
    this.options.dmqEligible && request.setDMQEligible(true);
    this.options.messageId && request.setApplicationMessageId(this.options.messageId);
    if (this.options.visualization === 'on' && !this.options.messageId) request.setApplicationMessageId(randomUUID());
    this.options.messageType && request.setApplicationMessageType(this.options.messageType);
    this.options.replyToTopic && request.setReplyTo(solace.SolclientFactory.createTopicDestination(this.options.replyToTopic))
    if (this.options.userProperties) {
      let propertyMap = new solace.SDTMapContainer();
      let props:Record<string, string | string[]> = this.options.userProperties;
      Object.entries(props).forEach((entry) => {
        propertyMap.addField(entry[0], solace.SDTField.create(solace.SDTFieldType.STRING, entry[1]));
      });
      request.setUserPropertyMap(propertyMap);    
    } 

    Logger.logSuccess(`request sent on topic ${topicName}`)
    Logger.printMessage(request.dump(0), request.getUserPropertyMap(), request.getBinaryAttachment(), this.options.outputMode);
    try {
      if (this.options.replyToTopic) {
        //Session subscription
        this.session.subscribe(
          solace.SolclientFactory.createTopicDestination(this.options.replyToTopic),
          true, // generate confirmation when subscription is added successfully
          this.options.replyToTopic, // use topic name as correlation key
          this.options.readTimeout ? this.options.readTimeout : 10000 // 10 seconds timeout for this operation, if not specified
        );                
      }
      
      this.session.sendRequest(
        request,
        this.options.timeout, // 5 seconds timeout for this operation
        (session:any, message:any) => {
          Logger.logSuccess(`reply received for request on topic '${request.getDestination()?.getName()}'`);
          Logger.printMessage(message.dump(0), message.getUserPropertyMap(), message.getBinaryAttachment(), this.options.outputMode);
          this.publishVisualizationEvent(this.session, this.options, STM_EVENT_REPLY_RECEIVED, { 
            type: 'requestor', topicName: topicName + ' [reply]', clientName: this.clientName, uuid: uuid(), msgId: message.getApplicationMessageId()
          })    
          if (this.options.waitBeforeExit) {
            setTimeout(() => {
              Logger.logWarn(`exiting session (waited-before-exit set for ${this.options.waitBeforeExit})...`);
              this.exit();
            }, this.options.waitBeforeExit * 1000);
          } else {
            this.exit();
          }
        },
        (session:any, event:any) => {
          Logger.logDetailedError('send request failed - ', event.infoStr)
          if (this.options.waitBeforeExit) {
            setTimeout(() => {
              Logger.logWarn(`exiting session (waited-before-exit set for ${this.options.waitBeforeExit})...`);
              this.exit();
            }, this.options.waitBeforeExit * 1000);
          } else {
            this.exit();
          }
        },
        null // not providing correlation object
      );
      this.publishVisualizationEvent(this.session, this.options, STM_EVENT_REQUESTED, { 
        type: 'requestor', topicName, clientName: this.clientName, uuid: uuid(), msgId: request.getApplicationMessageId()
      })    
    } catch (error:any) {
      Logger.logDetailedError('send request failed - ', error.toString())
      if (error.cause?.message) Logger.logDetailedError(``, `${error.cause?.message}`)
    }
  }

  // Gracefully disconnects from Solace PubSub+ Event Broker
  disconnect = () => {
    if (this.session !== null) {
      Logger.logSuccess('disconnecting from Solace PubSub+ Event Broker...');
      try {
        this.publishVisualizationEvent(this.session, this.options, STM_CLIENT_DISCONNECTED, {
          type: 'requestor', clientName: this.clientName, uuid: uuid() 
        })    
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
    setTimeout(() => {
      this.disconnect();
    }, 500); // wait for 1 second to disconnect
    setTimeout(function () {
      Logger.logSuccess('exiting...')
      process.exit(0);
    }, 1500); // wait for 1 second to finish
  };
}
