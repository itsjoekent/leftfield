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
  const jobId = get(job, 'id');
  jobLogger.child({ jobId });

  const domainRecordId = get(job, 'data.domainRecordId');

  try {
    if (!domainRecordId) {
      throw new Error(`No domainRecordId supplied for jobId:${jobId}`);
    }

    jobLogger.info(`Creating ssl certificate for domainRecordId:${domainRecordId}`);

    const domainRecord = await DomainRecord
      .findById(mongoose.Types.ObjectId(domainRecordId))
      .exec();

    if (!domainRecord) {
      throw new Error(`Failed to load domainRecord for domainRecordId:${domainRecordId}`);
    }

    const result = await createCertificate(domainRecord.name, jobLogger);
    if (result instanceof Error) {
      throw result;
    }

    await DomainRecord.findOneAndUpdate(
      { _id: domainRecord._id },
      { lastObtainedSslOn: Date.now() },
    ).exec();

    jobLogger.info(`Successfully created ssl certificate for domainRecordId:${domainRecordId}`);
  } catch (error) {
    jobLogger.error(`Encountered error creating ssl certificate for domainRecordId:${domainRecordId}`, error);
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
