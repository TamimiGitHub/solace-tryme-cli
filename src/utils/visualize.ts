import { Logger } from './logger'
import { loadCommandFromConfig, updateVisualizeConfig } from './config';
import { defaultConfigFile } from './defaults';

const visualize = async (options: MessageClientOptions) => {
  const configFile = options.config ? options.config : defaultConfigFile;
  updateVisualizeConfig(configFile, 'on');

  const config = loadCommandFromConfig('connection', options);
  const url = new URL(config.url);
  console.log(config.url, '\n', url);
  console.log(url.hostname, config.url.substring(config.url.lastIndexOf(':')+1), config.username, config.password);
  console.log(__dirname);

    // Imports
  const express = require('express');
  const app = express();
  app.use(express.static('public'));
  app.get('/config', (req:any, res:any) => {
    var configuration = {
      "MQTT_HOST": `${url.hostname}`,
      "MQTT_PORT": 8443, //`${config.url.substring(config.url.lastIndexOf(':')+1)}`,
      "MQTT_USER_NAME":   `${config.username}`,
      "MQTT_PASSWORD": `${config.password}`
    };

    res.json(configuration);
  })

  let http = require('http');
  let server = http.createServer(app);
  server.listen(0, () => {
    console.info(`App listening on port ${server.address().port}`);
    var opener = require("opener");
    opener(`http://localhost:${server.address().port}`)
  });

  process.on('SIGINT', function () {
    'use strict';
    updateVisualizeConfig(configFile, 'off');
    Logger.logWarn('exiting...')
    process.exit(0);
  });

}
export default visualize

export { visualize }
