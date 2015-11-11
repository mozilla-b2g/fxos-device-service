let adb = require('./adb');
let bodyParser = require('body-parser');
let debug = console.log.bind(console, '[service]');
let express = require('express');
let http = require('http');
let session = require('./session');
let sendFromDevice = require('./sendFromDevice');

let server;

exports.start = function start(options = {}) {
  let app = express();

  app.use(bodyParser.json());
  app.use(session());
  app.use(adb({path: options.adbPath}));
  app.use(sendFromDevice());
  app.use('/', require('./routes/root'));
  app.use('/connections', require('./routes/connections'));
  app.use('/crashes', require('./routes/crashes'));
  app.use('/devices', require('./routes/devices'));
  app.use('/device', require('./routes/device'));
  app.use('/events', require('./routes/events'));
  app.use('/files', require('./routes/files'));
  app.use('/logs', require('./routes/logs'));
  app.use('/processes', require('./routes/processes'));
  app.use('/profile', require('./routes/profile'));
  app.use('/properties', require('./routes/properties'));
  app.use('/restart', require('./routes/restart'));
  app.use('*', require('./routes/unspecified'));

  debug('Will start server with options', JSON.stringify(options));
  server = http.createServer(app);
  server.listen(options.port || 8080);
};

exports.stop = function stop() {
  debug('Will stop server');
  server.close();
};
