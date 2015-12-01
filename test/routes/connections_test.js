let request = require('../request');
let tcpPortUsed = require('tcp-port-used');

suite('/connections', () => {
  let port;
  let id;

  suiteSetup(async function() {
    let res = await request('GET', 3000, '/devices');
    id = JSON.parse(res.body)[0].id;
  });

  test('should return proxied tcp port', async function() {
    let res = await request('POST', 3000, `/devices/${id}/connections/4000`);
    port = parseInt(res.body, 10);
    await tcpPortUsed.waitUntilUsed(port);
    port.should.be.gte(10000);
  });

  test('should remove proxied tcp port', async function() {
    let res = await request('DELETE', 3000, `/devices/${id}/connections/${port}`);
    res.statusCode.should.equal(200);
    await tcpPortUsed.waitUntilFree(port);
  });
});
