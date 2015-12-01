let get = require('../get');

suite('crash reports', () => {
  let crashIds;
  let id;

  suiteSetup(async function() {
    let res = await get(3000, '/devices');
    id = JSON.parse(res.body)[0].id;
  });

  test('GET /crashes', async function() {
    let res = await get(3000, `/devices/${id}/crashes`);
    crashIds = JSON.parse(res.body);
    crashIds.should.deep.equal([
      '22f48403-a8a6-2ea7-1e56c0bf-70f628d5',
      '4704e5eb-7e73-ddff-797cd094-72b8facf',
      '56995658-21a1-c050-6cb5287e-76fb7bf1'
    ]);
  });

  test('GET /crashes/:id exists', async function() {
    let res = await get(3000, `/devices/${id}/crashes/${crashIds[0]}`);
    res.statusCode.should.equal(200);
    res.body.length.should.be.gt(0);
  });

  test('GET /crashes/:id not found', async function() {
    let res = await get(3000, `/devices/${id}/crashes/does-not-exist`);
    res.statusCode.should.equal(404);
  });
});
