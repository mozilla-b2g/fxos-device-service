let express = require('express');
let http = require('http');
let timeout = require('connect-timeout');

let server;

exports.start = function start(port = 8080) {
  let app = express();

  // We shouldn't timeout log requests.
  app.get('/log', require('./log'));

  app.use(timeout('5s'));

  app.get('/', (req, res) => res.send('200 OK'));
  app.get('/crashes', require('./list_crash_reports'));
  app.get('/crashes/:id', require('./get_crash_report'));
  app.get('/info', require('./info'));
  app.post('/connection/:port', require('./connect'));
  app.post('/profile', require('./profile'));
  app.post('/restart', require('./restart'));
  app.delete('/connection/:port', require('./disconnect'));

  // Error handling.
  app.use((err, req, res, next) => {
    if (req.timedout) {
      return res.status(500).send('Request timeout exceeded!');
    }

    if (err) {
      return res.status(500).send(err.message);
    }

    res.status(404).send('404 Not Found');
  });

  server = http.createServer(app);
  server.listen(port);
};

exports.stop = function stop() {
  server.close();
};
