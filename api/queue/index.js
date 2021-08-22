const Queue = require('bee-queue');
const { v4: uuid } = require('uuid');

const logger = require('../utils/logger');

module.exports = (name) => {
  const publisher = new Queue(name, {
    redis: process.env.REDIS_URL,
    getEvents: false,
    isWorker: false,
    sendEvents: false,
  });

  const consumer = new Queue(name, {
    redis: process.env.REDIS_URL,
    getEvents: false,
    isWorker: true,
    sendEvents: false,
    removeOnFailure: true,
  });

  async function publishJob(payload, retryPolicy = ['exponential', 1000]) {
    const jobId = uuid();
    const job = publisher.createJob(payload);

    logger.info(`Adding ${jobId} to ${name} queue`);

    await job.setId(jobId).save();
    return jobId;
  }

  return {
    publishJob,
    publisher,
    consumer,
  };
}
