let get = require('../get');

suite('routing', () => {
  test('/', async function() {
    let res = await get(3000, '/');
    res.statusCode.should.equal(200);
  });

  test('404', async function() {
    let res = await get(3000, '/eh');
    res.statusCode.should.equal(404);
  });
});
