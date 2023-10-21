import concat from 'concat-stream'
import { checkPubTopicExists, checkConnectionParamsExists } from '../utils/parse'
import { saveConfig, loadConfig } from '../utils/config'
import { SolaceClient } from '../common/publish-client'
import { Logger, Signal } from '../utils/logger'
import { defaultMessage, defaultPublishTopic } from '../utils/defaults';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const send = async (
  options: ClientOptions
) => {
  const { count, interval } = options;
  const publisher = new SolaceClient(options);
  await publisher.connect();
  let message = options.message as string;
  for (var iter=count ? count : 1, n=1;iter > 0;iter--, n++) {
    if (message === defaultMessage)
      publisher.publish(options.topic, message.concat(` [${n}]`));
    else
      publisher.publish(options.topic, message);

    if (delay && interval) await delay(interval)
  }

  publisher.disconnect();
}

const publisher = (options: ClientOptions) => {
  const { save, view, config, helpExamples } = options

  if (helpExamples) {
        console.log(`
Example:
// publish a message with default settings (broker, vpn, username and password and topic).      
stm publish

// publish on topic ${defaultPublishTopic} with default settings (broker, vpn, username and password).    
stm publish -t ${defaultPublishTopic}

// publish 5 messages with 1 sec interval between publish on topic '${defaultPublishTopic}' 
// to broker 'default' on endpoint 'ws://localhost:8008' with username 'default' and password 'default'.
stm publish -U ws://localhost:8008 -v default -u default -p default -t ${defaultPublishTopic} -c 5 -i 1000
        `);
    process.exit(0);
  }

  if (typeof view === 'string') {
    options = loadConfig('publisher', view);
    Logger.printConfig('publisher', options);
    process.exit(0);
  } else if (typeof view === 'boolean') {
    options = loadConfig('publisher', 'stm-cli-config.json');
    Logger.printConfig('publisher', options);
    process.exit(0);

  }

  if (save && options) {
    Logger.printConfig('publisher', options);
    saveConfig('publisher', options);
    process.exit(0);
  }

  if (config) {
    options = loadConfig('publisher', config);
    Logger.printConfig('publisher', options);
  }

  // check connection params found
  checkConnectionParamsExists(options.url, options.vpn, options.username, options.password);

  // check publish topic found
  // checkPubTopicExists(options.topic);

  if (options.stdin) {
    Logger.ctrlDToPublish();
    process.stdin.pipe(
      concat((data) => {
        options.message = data.toString().slice(0, -1)
        send(options)
      }),
    )
  } else {
    send(options)
  }
}

export default publisher

export { publisher }
