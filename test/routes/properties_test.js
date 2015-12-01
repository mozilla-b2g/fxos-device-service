let get = require('../get');
let http = require('http');

suite('/properties', () => {
  let id;

  suiteSetup(async function() {
    let res = await get(3000, '/devices');
    id = JSON.parse(res.body).id;
  });

  suite('GET /properties', () => {
    test('should fetch many properties', async function() {
      let res = await get(3000, `/devices/${id}/properties`);
      JSON.parse(res.body).should.contain.all.keys([
        'wlan.driver.status',
        'ro.build.version.sdk',
        'ro.use_data_netmgrd'
      ]);
    });

    test('should fetch a single property', async function() {
      let res = await get(3000, `/devices/${id}/properties/wlan.driver.status`);
      JSON.parse(res.body).should.equal('ok');
    });

    test('should parse numbers', async function() {
      let res = await get(3000, `/devices/${id}/properties/ro.build.version.sdk`);
      JSON.parse(res.body).should.equal(19);
    });

    test('should parse booleans', async function() {
      let res = await get(3000, `/devices/${id}/properties/ro.use_data_netmgrd`);
      JSON.parse(res.body).should.equal(true);
    });
  });

  suite('POST /properties', () => {
    let options = {
      hostname: '127.0.0.1',
      port: 3000,
      path: `/devices/${id}/properties`,
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

});
