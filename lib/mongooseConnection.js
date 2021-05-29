require('dotenv').config()
const dbConfig = require('../config/db.config.js');

const mongoose = require('mongoose');

// Set up default mongoose connection
const mongoDB = dbConfig.HOST + ':' + dbConfig.PORT + '/' + dbConfig.DB;
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

mongoose
	.connect(mongoDB, mongoOptions).
	catch(err => {
		console.error('Error connecting to MongoDB: ' + err)
		process.exit();
	});

mongoose.connection.on('connected', function () {  
  console.log('Connection made to Mongo at: ' + mongoDB);
}); 

// If the connection throws an error after initially connecting
mongoose.connection.on('error',function (err) {  
  console.log('Mongo connection error: ' + err);
  process.exit();
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoo connection disconnected'); 
});

module.exports = mongoose;