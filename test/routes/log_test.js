let exec = require('mz/child_process').exec;
let http = require('http');

function getLog(options) {
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
}

suite('/log', () => {
  let log = '';

  setup(async function() {
    log = await getLog();
  });

  test('should pipe data to browser', () => {
    log.length.should.be.gt(0);
  });

  test('should kill adb process when client disconnects', async function() {
    let [ps] = await exec('ps au');
    ps.should.not.match(/adb.*logcat/);
  });
});

suite('/log multiple', () => {
  let logA = '';
  let logB = '';

  setup(async function () {
    logA = await getLog({headers: {'X-Android-Serial': 'f30eccef'}});
    logB = await getLog({headers: {'X-Android-Serial': '04fb7d5bc6d37039'}});
  });

  test('get different log per device', () => {
    logA.should.match(/ANDROID_SERIAL.*f30eccef/);
    logB.should.match(/ANDROID_SERIAL.*04fb7d5bc6d37039/);
  });
});
