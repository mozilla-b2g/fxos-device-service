let request = require('../request');

suite('POST /restart', () => {
  test('soft', async function() {
    let res = await request('POST', 3000, '/restart?hard=false');
    res.statusCode.should.equal(200);
  });

  test('hard', async function() {
    let res = await request('POST', 3000, '/restart?hard=true');
    res.statusCode.should.equal(200);
  });
});
