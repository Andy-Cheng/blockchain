/**
 *@file Connects to mongoDB 
 * If the file is used for production, please change dbUrl to the url of db for production.
 */

const mongoose = require("mongoose");

const dbUrl = 'mongodb://localhost/blockchain'
mongoose.set('debug', true);
mongoose.connect(dbUrl, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // connected successfully
  console.log('connected to db successfully');
});

