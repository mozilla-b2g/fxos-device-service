let request = require('../request');
let tcpPortUsed = require('tcp-port-used');

suite('/connections', () => {
  let port;

  setup(async function () {
    let res = await request('POST', 3000, '/connections/4000');
    port = parseInt(res.body, 10);
    await tcpPortUsed.waitUntilUsed(port);
  });

  teardown(async function () {
    let res = await request('DELETE', 3000, `/connections/${port}`);
    res.statusCode.should.equal(200);
    await tcpPortUsed.waitUntilFree(port);
  });

  test('should return proxied tcp port', () => {
    port.should.be.gte(10000);
  });
});
