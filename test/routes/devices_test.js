let get = require('../get');

suite('GET /devices', async function () {
  let data;

  setup(async function () {
    let res = await get(3000, '/devices');
    data = JSON.parse(res.body);
  });

  test('should be multiple devices', () => {
    data.length.should.equal(2);
  });

  test('should have identifiable devices', () => {
    data[0].id.should.equal('f30eccef');
    data[0].description.should.equal('device');
    data[1].id.should.equal('04fb7d5bc6d37039');
    data[1].description.should.equal('device');
  });
});
