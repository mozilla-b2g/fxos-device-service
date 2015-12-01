let request = require('../request');

suite('POST /restart', () => {
  let id;

  suiteSetup(async function() {
    let res = await request('GET', 3000, '/devices');
    id = JSON.parse(res.body).id;
  });

  test('soft', async function() {
    let res = await request('POST', 3000, `/devices/${id}/restart?hard=false`);
    res.statusCode.should.equal(200);
  });

  test('hard', async function() {
    let res = await request('POST', 3000, `/devices/${id}/restart?hard=true`);
    res.statusCode.should.equal(200);
  });
});
