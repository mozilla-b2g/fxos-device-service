let get = require('../get');

suite('unspecified', () => {
  test('404', async function() {
    let res = await get(3000, '/eh');
    res.statusCode.should.equal(404);
  });
});
