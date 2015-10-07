let exec = require('mz/child_process').exec;
let get = require('./get');
let http = require('http');
let service = require('../src/service');
let tcpPortUsed = require('tcp-port-used');

suite('service', () => {
  setup(async function() {
    // Make sure that our fake adb gets used instead of
    // the real thing.
    process.env.PATH = `${__dirname}:${process.env.PATH}`;
    service.start(3000);
    await tcpPortUsed.waitUntilUsed(3000);
  });

  teardown(async function() {
    service.stop();
    await tcpPortUsed.waitUntilFree(3000);
  });

  test('/', async function() {
    let res = await get('http://localhost:3000/');
    res.statusCode.should.equal(200);
    res.body.should.equal('200 OK');
  });

  test('404', async function() {
    let res = await get('http://localhost:3000/eh');
    res.statusCode.should.equal(404);
    res.body.should.equal('404 Not Found');
  });

  suite('/log', () => {
    let log = '';

    setup(done => {
      let req = http.get('http://localhost:3000/log', res => {
        function onend() {
          done(new Error('Log request ended unexpectedly'));
        }

        res.setEncoding('utf8');
        res.on('data', chunk => log += chunk);
        res.on('end', onend);

        // Close the request to /log after some time elapses.
        setTimeout(async function() {
          // At this point we should have a logcat process.
          let [ps] = await exec('ps -au');
          ps.should.include('adb logcat');
          res.removeListener('end', onend);
          req.abort();
          done();
        }, 500);
      });
    });

    test('should pipe data to browser', () => {
      log.length.should.be.gt(0);
    });

    test('should kill adb process when client disconnects', async function() {
      let [ps] = await exec('ps -au');
      ps.should.not.include('adb logcat');
    });
  });
});
