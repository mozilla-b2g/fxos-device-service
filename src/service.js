let express = require('express');
let http = require('http');

let server;

exports.start = function start(port = 8080) {
  let app = express();
  app.get('/', (req, res) => res.send('200 OK'));
  app.get('/crashes', require('./list_crash_reports'));
  app.get('/crashes/:id', require('./get_crash_report'));
  app.get('/info', require('./info'));
  app.get('/log', require('./log'));
  app.get('*', (req, res) => res.status(404).send('404 Not Found'));
  app.post('/connection/:port', require('./connect'));
  app.post('/profile', require('./profile'));
  app.post('/restart', require('./restart'));
  app.delete('/connection/:port', require('./disconnect'));
  server = http.createServer(app);
  server.listen(port);
};

exports.stop = function stop() {
  server.close();
};
