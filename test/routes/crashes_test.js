let get = require('../get');

suite('crash reports', () => {
  let crashIds;

  setup(async function() {
    let res = await get(3000, '/crashes');
    crashIds = JSON.parse(res.body);
  });

  test('/crashes', () => {
    crashIds.should.deep.equal([
      '22f48403-a8a6-2ea7-1e56c0bf-70f628d5',
      '4704e5eb-7e73-ddff-797cd094-72b8facf',
      '56995658-21a1-c050-6cb5287e-76fb7bf1'
    ]);
  });

  test('/crashes/:id', async function() {
    let res = await get(3000, `/crashes/${crashIds[0]}`);
    res.statusCode.should.equal(200);
    res.body.length.should.be.gt(0);
  });

  test('/crashes/:id 404', async function() {
    let res = await get(3000, `/crashes/does-not-exist`);
    res.statusCode.should.equal(404);
  });
});
