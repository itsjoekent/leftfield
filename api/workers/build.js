const cluster = require('cluster');
const path = require('path');
const os = require('os');

if (process.env.NODE_ENV === 'development') {
  require(path.join(process.cwd(), 'environment/development.api'));
}

const { renderToString } = require('react-dom/server');
const {

} = 'pkg.campaign-components';

const mongoose = require('../db');
// const Assembly = require('../db/Assembly');
const { consumer } = require('../utils/buildQueue');
const logger = require('../utils/logger');

logger.child({ worker: 'build' });

consumer.process(1, async function(job) {
  try {
    const { id, data: { snapshotId } } = job;

    // const assembly = await Assembly.findById(mongoose.Types.ObjectId(assemblyId));
    // if (!assembly) {
    //   throw new Error(`Failed to load given assemblyId:${assemblyId}`);
    // }

    console.log(snapshotId);
    return true;
  } catch (error) {
    logger.error(error);
    throw error; // @NOTE: Forcing queue to retry
  }
});

if (cluster.isPrimary) {
  const totalProcessors = os.cpus().length;
  logger.info(`Spawning ${totalProcessors} build worker(s)...`);

  for (let index = 0; index < totalProcessors; index++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Build Worker [PID=${worker.process.pid}] died with code=${code} signal=${signal}`);
    cluster.fork();
  });
}
