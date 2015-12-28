let eventToPromise = require('event-to-promise');
let {exec} = require('mz/child_process');
let fs = require('mz/fs');
let get = require('../get');
let http = require('http');
let tempdir = require('../../src/tempdir');

suite('profile', () => {
  let id;

  suiteSetup(async function() {
    let res = await get(3000, '/devices');
    id = JSON.parse(res.body)[0].id;
  });

  test('GET /profile', async function() {
    let dir = await tempdir();
    let filename = `${dir}/profile.tar.gz`;
    let writer = fs.createWriteStream(filename);

    await new Promise(resolve => {
      http
        .request({
          method: 'GET',
          hostname: '127.0.0.1',
          port: 3000,
          path: `/devices/${id}/profile`
        }, res => {
          res.pipe(writer);
          res.on('end', resolve);
        })
        .end();
    });

    writer.close();
    await exec(`tar -xvf profile.tar.gz`, {cwd: dir});
    let files = await fs.readdir(dir);
    files.should.deep.equal([
      'compatibility.ini',
      'prefs.js',
      'profile.tar.gz',
      'safebrowsing',
      'times.json'
    ]);
  });

  test('POST /profile', async function() {
    let filename = __dirname + '/../fixtures/profile.tar.gz';
    let reader = fs.createReadStream(filename);
    let {connection, promise} = request({
      method: 'POST',
      hostname: '127.0.0.1',
      port: 3000,
      path: `/devices/${id}/profile`
    });

    reader.pipe(connection);
    await eventToPromise(reader, 'end');
    connection.end();
    let res = await promise;
    res.statusCode.should.equal(200);
  });
});

function request(options) {
  let connection;
  let promise = new Promise((resolve, reject) => {
    connection = http.request(options, resolve);
    connection.on('error', reject);
  });

  return {connection, promise};
}
