let fs = require('mz/fs');
let get = require('../get');
let path = require('path');
let restler = require('restler');

function upload(url, file, mode) {
  return new Promise((resolve, reject) => {
    let data = {upload: file};

    if (mode) {
      data.mode = mode;
    }

    let req = restler.put(url, {multipart: true, data: data});

    req.on('complete', (result, response) => {
      result instanceof Error ?
        reject(result) :
        resolve(response);
    });
  });
}

async function file(location) {
  let stats = await fs.stat(location);
  return restler.file(location, null, stats.size, null, 'text/plain');
}

suite('GET /files', () => {
  test('should succeed if file exists', async function() {
    let res = await get(3000, '/files?filepath=/data/b2g/mozilla/profiles.ini');
    res.statusCode.should.equal(200);
    res.body.length.should.be.gt(0);
  });

  test('should fail if not found', async function() {
    let res = await get(3000, '/files?filepath=/data/b2g/mozilla/wat');
    res.statusCode.should.equal(404);
  });

  test('should fail if no file specified', async function() {
    let res = await get(3000, '/files');
    res.statusCode.should.equal(422);
  });

  test('should fail if file blank', async function() {
    let res = await get(3000, '/files?filepath=');
    res.statusCode.should.equal(422);
  });
});

suite('PUT /files', () => {
  let uploadFile;

  setup(async function() {
    uploadFile = await file(path.resolve(`${__dirname}/../fixtures/profiles.ini`));
  });

  test('should upload OK', async function() {
    let url = 'http://localhost:3000/files?filepath=/data/b2g/mozilla/profiles.ini';
    let res = await upload(url, uploadFile);
    res.statusCode.should.equal(200);
  });

  test('should fail if no filepath', async function() {
    let url = 'http://localhost:3000/files';
    let res = await upload(url, uploadFile);
    res.statusCode.should.equal(422);
  });

  test('should fail if filepath empty', async function() {
    let url = 'http://localhost:3000/files?filepath=';
    let res = await upload(url, uploadFile);
    res.statusCode.should.equal(422);
  });

  test('should allow setting numerical permissions mode', async function() {
    let url = 'http://localhost:3000/files?filepath=/data/b2g/mozilla/profiles.ini';
    let res = await upload(url, uploadFile, 777);
    res.statusCode.should.equal(200);
  });

  test('should allow setting string permissions mode', async function() {
    let url = 'http://localhost:3000/files?filepath=/data/b2g/mozilla/profiles.ini';
    let res = await upload(url, uploadFile, '+x');
    res.statusCode.should.equal(200);
  });

  test('should fail with bad permission mode', async function() {
    let url = 'http://localhost:3000/files?filepath=/data/b2g/mozilla/profiles.ini';
    let res = await upload(url, uploadFile, 'invalid');
    res.statusCode.should.equal(500);
  });
});
