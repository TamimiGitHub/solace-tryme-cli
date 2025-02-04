import { SolaceClient } from '../common/receive-client'
import { displayHelpExamplesForReceive } from '../utils/examples';
import { Logger } from '../utils/logger'
import { checkSubTopicExists, checkConnectionParamsExists, checkReceiverIntegrity, checkForCliTopics } from '../utils/checkparams'
import { saveOrUpdateCommandSettings } from '../utils/config';

const receive = async (
  options: MessageClientOptions,
  optionsSource: any
) => {
  const receiver = new SolaceClient(options);
  try {
    await receiver.connect();
    receiver.subscribe(options);
  } catch (error:any) {
    Logger.logError('exiting...')
    process.exit(1)
  }
  process.stdin.resume();
  process.on('SIGINT', function () {
    'use strict';
    Logger.logWarn('operation interrupted...')
    receiver.exit();
  });

  if (options.exitAfter) {
    setTimeout(function exit() {
      Logger.logWarn(`exiting session (exit-after set for ${options.exitAfter})...`);
      receiver.exit();
    }, options.exitAfter * 1000);
  }
}

const receiver = (options: MessageClientOptions, optionsSource: any) => {
  const { helpExamples, save } = options
  
  if (helpExamples) {
    displayHelpExamplesForReceive()
    process.exit(0);
  }

  // check connection params found
  checkConnectionParamsExists(options.url, options.vpn, options.username, options.password);

  // check connection params found
  checkReceiverIntegrity(options.topic, options.queue, options.createIfMissing);

  // check publish topic found
  checkSubTopicExists(options);

  // if subscriptions are specified, remove the default subscription at pos-0
  checkForCliTopics('topic', options, optionsSource);

  if (save) {
    saveOrUpdateCommandSettings(options, optionsSource)
    process.exit(0);
  }

  receive(options, optionsSource);
}

export default receiver

export { receiver }
