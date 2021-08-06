const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Students', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

mongoose.connection.on('connecting', () => {
  console.log('trying to establish a connection to mongo');
});

mongoose.connection.on('connected', () => {
  console.log('connection established successfully');
});

mongoose.connection.on('error', (err) => {
  console.log(`connection to mongo failed ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('mongo db connection closed');
});

module.exports = mongoose;
