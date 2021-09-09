const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const connectionOptions = {};

if (process.env.MONGODB_CERTIFICATE) {
  const certificatePath = require('path').join(__dirname, 'cert.crt');
  require('fs').writeFileSync(certificatePath, process.env.MONGODB_CERTIFICATE);

  connectionOptions.sslCA = certificatePath;
}

mongoose.connect(process.env.MONGODB_URL, connectionOptions);

module.exports = mongoose;
