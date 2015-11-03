let exec = require('mz/child_process').exec;
let get = require('./get');
let getLog = require('./get_log');
let http = require('http');
let path = require('path');
let request = require('./request');
let service = require('../src/service');
let tcpPortUsed = require('tcp-port-used');

suite('service', () => {
  setup(async function() {
    service.start({
      port: 3000,
      // Make sure that our fake adb gets used instead of the real thing.
      adbPath: path.resolve(__dirname, 'adb')
    });

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

  suite('multiple devices', () => {
    let logA = '';
    let logB = '';

    setup(async function() {
      logA = await getLog({ headers: { 'X-Android-Serial': 'f30eccef' } });
      logB = await getLog({ headers: { 'X-Android-Serial': '04fb7d5bc6d37039' } });
    });

    test('get different log per device', () => {
      logA.should.match(/ANDROID_SERIAL.*f30eccef/);
      logB.should.match(/ANDROID_SERIAL.*04fb7d5bc6d37039/);
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

  suite('/devices', async function() {
    let data;

    setup(async function() {
      let res = await get(3000, '/devices');
      data = JSON.parse(res.body);
    });

    test('should be multiple devices', () => {
      data.length.should.equal(2);
    });

    test('should have identifiable devices', () => {
      data[0].id.should.equal('f30eccef');
      data[0].description.should.equal('device');
      data[1].id.should.equal('04fb7d5bc6d37039');
      data[1].description.should.equal('device');
    });
  });

  suite('/device', async function() {
    test('gaia commit', async function() {
      let res = await get(3000, '/device');
      let {sha, timestamp} = JSON.parse(res.body).gaia;
      sha.should.equal('f75bd584aca0a751a5bed115800250faa8412927');
      timestamp.should.equal('1445236798');
    });

    test('target specific device', async function() {
      let res = await get(3000, '/device', {
        headers: { 'X-Android-Serial': '04fb7d5bc6d37039' }
      });
      let {sha, timestamp} = JSON.parse(res.body).gaia;
      sha.should.equal('f75bd584aca0a751a5bed115800250faa8412927');
      timestamp.should.equal('1445236798');
    });

    test('target different device', async function() {
      let res = await get(3000, '/device', {
        headers: { 'X-Android-Serial': 'f30eccef' }
      });
      let {sha, timestamp} = JSON.parse(res.body).gaia;
      sha.should.equal('f75bd584aca0a751a5bed115800250faa8412927');
      timestamp.should.equal('1445236798');
    });

    test('target specific device via URL path', async function() {
      let res = await get(3000, '/devices/04fb7d5bc6d37039');
      let {sha, timestamp} = JSON.parse(res.body).gaia;
      sha.should.equal('f75bd584aca0a751a5bed115800250faa8412927');
      timestamp.should.equal('1445236798');
    });

    test('target different device via URL path', async function() {
      let res = await get(3000, '/devices/f30eccef');
      let {sha, timestamp} = JSON.parse(res.body).gaia;
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
