let exec = require('mz/child_process').exec;
let http = require('http');

module.exports = function(options) {
  return new Promise((resolve, reject) => {
    let log = '';
    let settings = Object.assign({
      method: 'GET',
      hostname: '127.0.0.1',
      port: 3000,
      path: '/log'
    }, options);
    let req = http.request(settings, res => {
      function onend() {
        reject(new Error('Log request ended unexpectedly'));
      }

      res.setEncoding('utf8');
      res.on('data', chunk => log += chunk);
      res.on('end', onend);

      // Close the request to /log after some time elapses.
      setTimeout(async function() {
        let [ps] = await exec('ps au');
        ps.should.match(/adb.*logcat/);
        res.removeListener('end', onend);
        req.abort();
        resolve(log);
      }, 500);
    });

    req.end();
  });
};
