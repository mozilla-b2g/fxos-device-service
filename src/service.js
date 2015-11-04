let express = require('express');
let http = require('http');
let session = require('./session');
let adb = require('./adb');

let server;

exports.start = function start(options = {}) {
  let app = express();

  app.use(session());
  app.use(adb({path: options.adbPath}));
  app.use('/', require('./routes/root'));
  app.use('/connection', require('./routes/connection'));
  app.use('/crashes', require('./routes/crashes'));
  app.use('/devices', require('./routes/devices'));
  app.use('/device', require('./routes/device'));
  app.use('/log', require('./routes/log'));
  app.use('/profile', require('./routes/profile'));
  app.use('/restart', require('./routes/restart'));
  app.use('*', require('./routes/unspecified'));

  server = http.createServer(app);
  server.listen(options.port || 8080);
};

exports.stop = function stop() {
  server.close();
};
