let get = require('../get');

suite('/device', async function () {
  test('gaia commit', async function () {
    let res = await get(3000, '/device');
    let {sha, timestamp} = JSON.parse(res.body).gaia;
    sha.should.equal('f75bd584aca0a751a5bed115800250faa8412927');
    timestamp.should.equal('1445236798');
  });

  test('target specific device', async function () {
    let res = await get(3000, '/device', {
      headers: {'X-Android-Serial': '04fb7d5bc6d37039'}
    });
    let {sha, timestamp} = JSON.parse(res.body).gaia;
    sha.should.equal('f75bd584aca0a751a5bed115800250faa8412927');
    timestamp.should.equal('1445236798');
  });

  test('target different device', async function () {
    let res = await get(3000, '/device', {
      headers: {'X-Android-Serial': 'f30eccef'}
    });
    let {sha, timestamp} = JSON.parse(res.body).gaia;
    sha.should.equal('f75bd584aca0a751a5bed115800250faa8412927');
    timestamp.should.equal('1445236798');
  });

  test('target specific device via URL path', async function () {
    let res = await get(3000, '/devices/04fb7d5bc6d37039');
    let {sha, timestamp} = JSON.parse(res.body).gaia;
    sha.should.equal('f75bd584aca0a751a5bed115800250faa8412927');
    timestamp.should.equal('1445236798');
  });

  test('target different device via URL path', async function () {
    let res = await get(3000, '/devices/f30eccef');
    let {sha, timestamp} = JSON.parse(res.body).gaia;
    sha.should.equal('f75bd584aca0a751a5bed115800250faa8412927');
    timestamp.should.equal('1445236798');
  });
});
