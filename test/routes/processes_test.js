let request = require('../request');

suite('DELETE /processes/:pid', () => {
  test('should succeed', async function() {
    let res = await request('DELETE', 3000, '/processes/1234');
    res.statusCode.should.equal(200);
  });
});
