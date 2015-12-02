let request = require('../request');

suite('/events', () => {
  let id;

  suiteSetup(async function() {
    let res = await request('GET', 3000, '/devices');
    id = JSON.parse(res.body)[0].id;
  });

  suite('POST /events', async function() {
    test('valid single', async function() {
      let data = [{event: 'doubletap', x: 100, y: 200}];
      let res = await request('POST', 3000, `/devices/${id}/events`, {data});
      res.statusCode.should.equal(200);
    });

    test('valid multiple', async function() {
      let data = [{event: 'doubletap', x: 100, y: 200}, {event: 'tap', x: 100, y: 200}];
      let res = await request('POST', 3000, `/devices/${id}/events`, {data});
      res.statusCode.should.equal(200);
    });

    test('missing data', async function() {
      let res = await request('POST', 3000, `/devices/${id}/events`);
      res.statusCode.should.equal(422);
    });

    test('empty data', async function() {
      let data = [];
      let res = await request('POST', 3000, `/devices/${id}/events`, {data});
      res.statusCode.should.equal(422);
    });

    test('invalid single', async function() {
      let data = [{event: 'tap', z: 50}];
      let res = await request('POST', 3000, `/devices/${id}/events`, {data});
      res.statusCode.should.equal(422);
    });

    test('invalid multiple', async function() {
      let data = [{event: 'tap', x: 50, y: 200}, {event: 'doubletap', z: 100}];
      let res = await request('POST', 3000, `/devices/${id}/events`, {data});
      res.statusCode.should.equal(422);
    });
  });

  suite('POST /events/doubletap', async function() {
    test('valid', async function() {
      let data = {x: 100, y: 200};
      let res = await request('POST', 3000, `/devices/${id}/events/doubletap`, {data});
      res.statusCode.should.equal(200);
    });

    test('missing data', async function() {
      let res = await request('POST', 3000, `/devices/${id}/events/doubletap`);
      res.statusCode.should.equal(422);
    });

    test('invalid', async function() {
      let data = {z: 50};
      let res = await request('POST', 3000, `/devices/${id}/events/doubletap`, {data});
      res.statusCode.should.equal(422);
    });
  });

  suite('POST /events/drag', async function() {
    test('valid', async function() {
      let data = {x: 100, y: 200, endX: 100, endY: 300, duration: 50};
      let res = await request('POST', 3000, `/devices/${id}/events/drag`, {data});
      res.statusCode.should.equal(200);
    });

    test('invalid', async function() {
      let data = {x: 100, y: 200, duration: 50};
      let res = await request('POST', 3000, `/devices/${id}/events/drag`, {data});
      res.statusCode.should.equal(422);
    });
  });

  suite('POST /events/keydown', async function() {
    test('valid', async function() {
      let data = {code: 13};
      let res = await request('POST', 3000, `/devices/${id}/events/keydown`, {data});
      res.statusCode.should.equal(200);
    });

    test('invalid', async function() {
      let data = {key: 13};
      let res = await request('POST', 3000, `/devices/${id}/events/keydown`, {data});
      res.statusCode.should.equal(422);
    });
  });

  suite('POST /events/keyup', async function() {
    test('valid', async function() {
      let data = {code: 13};
      let res = await request('POST', 3000, `/devices/${id}/events/keyup`, {data});
      res.statusCode.should.equal(200);
    });

    test('invalid', async function() {
      let data = {key: 13};
      let res = await request('POST', 3000, `/devices/${id}/events/keyup`, {data});
      res.statusCode.should.equal(422);
    });
  });

  suite('POST /events/reset', async function() {
    test('valid', async function() {
      let res = await request('POST', 3000, `/devices/${id}/events/reset`);
      res.statusCode.should.equal(200);
    });
  });

  suite('POST /events/sleep', async function() {
    test('valid', async function() {
      let data = {duration: 250};
      let res = await request('POST', 3000, `/devices/${id}/events/sleep`, {data});
      res.statusCode.should.equal(200);
    });

    test('invalid', async function() {
      let data = {sleep: 250};
      let res = await request('POST', 3000, `/devices/${id}/events/sleep`, {data});
      res.statusCode.should.equal(422);
    });
  });

  suite('POST /events/tap', async function() {
    test('valid', async function() {
      let data = {x: 100, y: 200};
      let res = await request('POST', 3000, `/devices/${id}/events/tap`, {data});
      res.statusCode.should.equal(200);
    });

    test('invalid', async function() {
      let data = {z: 50};
      let res = await request('POST', 3000, `/devices/${id}/events/tap`, {data});
      res.statusCode.should.equal(422);
    });
  });

});
