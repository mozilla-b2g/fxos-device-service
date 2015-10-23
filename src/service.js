let express = require('express');
let http = require('http');
let session = require('./session');
let adb = require('./adb');

let server;

exports.start = function start(options = {}) {
  let app = express();

  app.use(session());
  app.use(adb({path: options.adbPath}));

  app.get('/', (req, res) => res.send('200 OK'));
  app.get('/crashes', require('./list_crash_reports'));
  app.get('/crashes/:id', require('./get_crash_report'));
  app.get('/devices', require('./devices'));
  app.get('/device', require('./device'));
  app.get('/device/:id', require('./device'));
  app.get('/log', require('./log'));
  app.get('*', (req, res) => res.status(404).send('404 Not Found'));
  app.post('/connection/:port', require('./connect'));
  app.post('/profile', require('./profile'));
  app.post('/restart', require('./restart'));
  app.delete('/connection/:port', require('./disconnect'));

  server = http.createServer(app);
  server.listen(options.port || 8080);
};

exports.stop = function stop() {
  server.close();
};
