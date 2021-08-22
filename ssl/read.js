const NODE_ENV = process.env.NODE_ENV;

const fs = require('fs');
const path = require('path');

module.exports = async function readCert() {
  if (NODE_ENV === 'development') {
    const cert = await fs.promises.readFile(path.join(__dirname, 'tls-localhost.cert'));
    const key = await fs.promises.readFile(path.join(__dirname, 'tls-localhost.key'));

    return { cert, key };
  }

  throw new Error('Remote cert loading not supported yet');
}
