const NODE_ENV = process.env.NODE_ENV;

const cluster = require('cluster');
const os = require('os');
const path = require('path');

if (NODE_ENV === 'development') {
  require(path.join(process.cwd(), 'environment/development.api'));
}

const { get } = require('lodash');

const mongoose = require('../../db');
const DomainRecord = require('../../db/DomainRecord');
const { consumer } = require('../../queue/ssl');
const logger = require('../../utils/logger');

const createCertificate = require('./createCertificate');

logger.child({ task: 'ssl' });

consumer.process(1, async function(job) {
  logger.child({ jobId: get(job, 'id') });

  try {
    const { data: { domainRecordId } } = job;

    logger.info(`Creating ssl certificate for domainRecordId:${domainRecordId}`);

    const domainRecord = await DomainRecord
      .findById(mongoose.Types.ObjectId(domainRecordId))
      .exec();

    if (!domainRecord) {
      throw new Error(`Failed to load domainRecord for domainRecordId:${domainRecordId}`);
    }

    await createCertificate(domainRecord.name);

    await DomainRecord.findOneAndUpdate(
      { _id: domainRecord._id },
      { lastObtainedSslOn: Date.now() },
    ).exec();

    logger.info(`Successfully created ssl certificate for domainRecordId:${domainRecordId}`);
  } catch (error) {
    logger.error(`Encountered error creating ssl certificate for domainRecordId:${domainRecordId}`, error);
  }
});

if (cluster.isPrimary && NODE_ENV !== 'development') {
  const totalProcessors = os.cpus().length;
  logger.info(`Spawning ${totalProcessors} ssl worker(s)...`);

  for (let index = 0; index < totalProcessors; index++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Build Worker [PID=${worker.process.pid}] died with code=${code} signal=${signal}`);
    cluster.fork();
  });
}
