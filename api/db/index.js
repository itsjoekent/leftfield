const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const connectionOptions = {};

if (process.env.MONGODB_CERTIFICATE) {
  connectionOptions.sslCA = process.env.MONGODB_CERTIFICATE;
}

mongoose.connect(process.env.MONGODB_URL, connectionOptions);

module.exports = mongoose;
