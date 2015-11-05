let request = require('../request');

suite('/kill', () => {
  test('should succeed', async function() {
    let res = await request('POST', 3000, '/kill/1234');
    res.statusCode.should.equal(200);
  });
});
