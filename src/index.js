// Require modules
// require('./config/db.js');
var express = require('express');
var app = express();
var CONFIG = require('./config/config.js');
var path = require('path');
const cors = require('cors');
// const _ = require('underscore');
var bodyParser = require('body-parser');
var endpoints = require('./routes/routes.js');
const Knexx = require('./config/knex.js');
const { Model } = require('objection');
Model.knex(Knexx);

// Middleware functions
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, Authorization, X-Requested-With, Content-Type, x-access-token, Content-Length, Accept");
  next();
});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use('/api', endpoints);

app.listen(CONFIG.server.port, (req, res) => {
   console.log(`Express server is listening on http://${CONFIG.server.host}:${CONFIG.server.port}`);

});


module.exports = app;