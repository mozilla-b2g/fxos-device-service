let get = require('./get');
let http = require('http');
let service = require('../src/service');
let tcpPortUsed = require('tcp-port-used');

suite('service', function() {
  setup(async function() {
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
});
