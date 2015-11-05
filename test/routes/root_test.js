let get = require('../get');

suite('root', () => {
  test('GET /', async function() {
    let res = await get(3000, '/');
    res.statusCode.should.equal(200);
  });
});
