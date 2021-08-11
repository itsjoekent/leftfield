const Queue = require('bee-queue');

const publisher = new Queue('build', {
  redis: process.env.REDIS_URL,
  isWorker: false,
});

const consumer = new Queue('build', {
  redis: process.env.REDIS_URL,
  isWorker: true,
});

module.exports = {
  publisher,
  consumer,
};
