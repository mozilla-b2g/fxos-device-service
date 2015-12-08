let adb = require('./adb');
let bodyParser = require('body-parser');
let cors = require('./cors');
let debug = console.log.bind(console, '[service]');
let express = require('express');
let http = require('http');
let sendFromDevice = require('./sendFromDevice');
let session = require('./session');

let server;

exports.start = function start(options = {}) {
  let app = express();

  app.use(bodyParser.json());
  app.use(session());
  app.use(adb({path: options.adbPath}));
  app.use(sendFromDevice());
  app.use(cors());
  app.use('/', require('./routes/root'));
  app.use('/devices', require('./routes/devices'));
  app.use('*', require('./routes/unspecified'));

  debug('Will start server with options', JSON.stringify(options));
  server = http.createServer(app);
  server.listen(options.port || 8080);
};

exports.stop = function stop() {
  debug('Will stop server');
  server.close();
};
