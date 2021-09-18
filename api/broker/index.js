const BROADCAST_URL = process.env.BROADCAST_URL;
const BROADCAST_USERNAME = process.env.BROADCAST_USERNAME;
const BROADCAST_PASSWORD = process.env.BROADCAST_PASSWORD;

const mqtt = require('mqtt');
const logger = require('../utils/logger');

const brokerConfig = {};
if (BROADCAST_USERNAME && BROADCAST_PASSWORD) {
  brokerAuth.username = BROADCAST_USERNAME;
  brokerAuth.password = BROADCAST_PASSWORD;
}

const brokerClient = mqtt.connect(BROADCAST_URL, brokerConfig);

brokerClient.on('error', () => logger.info('Error connecting to broker'));

const {
  BROADCAST_TOPIC,
  BROADCAST_EVENT_UPDATE_PUBLISHED_VERSION,
} = require('./events');

function updatePublishedVersion(host, versionNumber) {
  brokerClient.publish(BROADCAST_TOPIC, JSON.stringify({
    type: BROADCAST_EVENT_UPDATE_PUBLISHED_VERSION,
    data: { host, versionNumber },
  }));
}

module.exports = {
  updatePublishedVersion,
}
