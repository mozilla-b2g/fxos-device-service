let get = require('../get');
let http = require('http');

suite('GET /properties', () => {
  test('should fetch many properties', async function() {
    let res = await get(3000, '/properties');
    JSON.parse(res.body).should.contain.all.keys([
      'wlan.driver.status',
      'ro.build.version.sdk',
      'ro.use_data_netmgrd'
    ]);
  });

  test('should fetch a single property', async function() {
    let res = await get(3000, '/properties/wlan.driver.status');
    JSON.parse(res.body).should.equal('ok');
  });

  test('should parse numbers', async function() {
    let res = await get(3000, '/properties/ro.build.version.sdk');
    JSON.parse(res.body).should.equal(19);
  });

  test('should parse booleans', async function() {
    let res = await get(3000, '/properties/ro.use_data_netmgrd');
    JSON.parse(res.body).should.equal(true);
  });
});

suite('POST /properties', () => {
  let options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/properties',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  let data = {
    'persist.random.value': 42,
    'some.other.value': true,
    'hello': 'world'
  };

  test('should succeed', done => {
    let req = http.request(options, res => {
      res.statusCode.should.equal(200);
      done();
    });

    req.write(JSON.stringify(data));
    req.end();
  });

  test('should fail if no data', done => {
    let req = http.request(options, res => {
      res.statusCode.should.equal(422);
      done();
    });

    req.end();
  });
});
