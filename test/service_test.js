let exec = require('mz/child_process').exec;
let get = require('./get');
let http = require('http');
let net = require('net');
let request = require('./request');
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
    let res = await get(3000, '/');
    res.statusCode.should.equal(200);
    res.body.should.equal('200 OK');
  });

  test('404', async function() {
    let res = await get(3000, '/eh');
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

  suite('/connection', () => {
    let port;

    setup(async function() {
      let res = await request('POST', 3000, '/connection/4000');
      port = parseInt(res.body, 10);
      await tcpPortUsed.waitUntilUsed(port);
    });

    teardown(async function() {
      let res = await request('DELETE', 3000, `/connection/${port}`);
      res.statusCode.should.equal(200);
      res.body.should.equal('200 OK');
      await tcpPortUsed.waitUntilFree(port);
    });

    test('should return proxied tcp port', () => {
      port.should.be.gte(10000);
    });
  });

  suite('/info', async function() {
    let data;

    setup(async function() {
      let res = await get(3000, '/info');
      data = JSON.parse(res.body);
    });

    test('device id', () => {
      let {id, description} = data.device;
      id.should.equal('04fb7d5bc6d37039');
      description.should.equal('device');
    });

    test('gaia commit', () => {
      let {sha, timestamp} = data.commit;
      sha.should.equal('f75bd584aca0a751a5bed115800250faa8412927');
      timestamp.should.equal('1445236798');
    });
  });

  test('/restart soft', async function() {
    let res = await request('POST', 3000, '/restart?hard=false');
    res.body.should.equal('200 OK');
  });

  test('/restart hard', async function() {
    let res = await request('POST', 3000, '/restart?hard=true');
    res.body.should.equal('200 OK');
  });

  suite('crash reports', () => {
    let crashIds;

    setup(async function() {
      let res = await get(3000, '/crashes');
      crashIds = JSON.parse(res.body);
    });

    test('/crashes', () => {
      crashIds.should.deep.equal([
        '22f48403-a8a6-2ea7-1e56c0bf-70f628d5',
        '4704e5eb-7e73-ddff-797cd094-72b8facf',
        '56995658-21a1-c050-6cb5287e-76fb7bf1'
      ]);
    });

    test('/crashes/:id', async function() {
      let res = await get(3000, `/crashes/${crashIds[0]}`);
      res.statusCode.should.equal(200);
      res.body.length.should.be.gt(0);
      res.body.should.not.equal('404 Not Found');
    });
  });
});
