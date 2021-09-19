const mqtt = require('mqtt');
const ms = require('ms');

const BROADCAST_TOPIC = 'broadcast';
const BROADCAST_EVENT_DELETE = 'BROADCAST_EVENT_DELETE';
const BROADCAST_EVENT_NUKE = 'BROADCAST_EVENT_NUKE';
const BROADCAST_EVENT_UPDATE_PUBLISHED_VERSION = 'BROADCAST_EVENT_UPDATE_PUBLISHED_VERSION';

function connect(logger, url, username, password) {
  let brokerClient = null;

  logger.info('Connecting to broadcast broker...');

  if (url.startsWith('mqtt+ssl://')) {
    const brokerConfig = {
      username,
      password,
      protocol: 'mqtts',
      protocolVersion: 4,
      reconnectPeriod: ms('10 seconds'),
    };

    brokerClient = mqtt.connect(url.replace('mqtt+ssl://', 'mqtt://'), brokerConfig);
  } else {
    brokerClient = mqtt.connect(url);
  }

  brokerClient.on('connect', () => logger.info('Connected to broadcast broker'));

  brokerClient.on('error', (error) => logger.info(`Error connecting to broker: ${error.message}`));

  return brokerClient;
}

module.exports = {
  BROADCAST_TOPIC,
  BROADCAST_EVENT_DELETE,
  BROADCAST_EVENT_NUKE,
  BROADCAST_EVENT_UPDATE_PUBLISHED_VERSION,

  connect,
};
