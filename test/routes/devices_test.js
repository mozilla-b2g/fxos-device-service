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
    data[0].serial.should.equal('f30eccef');
    data[0].description.should.equal('device');
    data[1].serial.should.equal('04fb7d5bc6d37039');
    data[1].description.should.equal('device');
  });
});

suite('GET /devices/:id', async function() {
  let devices;
  let id;

  suiteSetup(async function() {
    let res = await get(3000, '/devices');
    devices = JSON.parse(res.body);
    id = devices[0].id;
  });

  test('device info', async function() {
    let res = await get(3000, `/devices/${id}`);
    let device = JSON.parse(res.body);
    device.dimensions.should.deep.equal([480, 854]);
    device.inputEvent.should.equal('/dev/input/event0');
    device.density.should.equal(320);
    device.pixelRatio.should.equal(2);
  });

  test('gaia commit', async function() {
    let res = await get(3000, `/devices/${id}`);
    let {sha, timestamp} = JSON.parse(res.body).gaia;
    sha.should.equal('f75bd584aca0a751a5bed115800250faa8412927');
    timestamp.should.equal('1445236798');
  });

  test('gecko commit', async function() {
    let res = await get(3000, `/devices/${id}`);
    let sha = JSON.parse(res.body).gecko;
    sha.should.equal('61dcc13d0848230382d5c85cdcf6721a05ee37c6');
  });

  test('target different device', async function() {
    let res = await get(3000, `/devices/${devices[1].id}`);
    let {sha, timestamp} = JSON.parse(res.body).gaia;
    sha.should.equal('f75bd584aca0a751a5bed115800250faa8412927');
    timestamp.should.equal('1445236798');
  });
});
