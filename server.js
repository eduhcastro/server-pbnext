var express = require('express')
var app = express()
var http = require('http').Server(app);
const Remote = require("./modules/Master");
const Gift = require("./modules/Gift");
const dotenv = require('dotenv');
const Master = new Remote("localhost", "postgres", "Hidden", "123456");
const pool = Master.Connection();

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


require('./routes/Login')(app,Master,pool);
require('./routes/Register')(app,Master,pool);
require('./routes/Code')(app,Gift,pool);
//require('./routes/Devo')(app,Master,pool); ## TESTE


http.listen(process.env.SERVER_PORT, function() {
   console.log('CASTROMS')
   console.log(`SERVER STARTED // PORT: ${process.env.SERVER_PORT}`);
});