let {createReadStream} = require('fs');
let {exec} = require('mz/child_process');
let path = require('path');
let tempdir = require('./tempdir');

function middleware(req, res, next) {
  res.sendFromDevice = async function(source, options = {}) {
    let local = await tempdir();

    try {
      let file = await copyToLocal(req.adb, source, local, options);
      let stream = createReadStream(file);
      stream.pipe(res);
      req.socket.on('close', () => stream.unpipe(res));
    } catch (error) {
      if (/remote object '.+' does not exist/.test(error.message)) {
        return res.sendStatus(404);
      }

      res.sendStatus(500);
    }
  };

  next();
}

async function copyToLocal(adb, source, local, options) {
  let filename = path.basename(source);
  if (!options.isFolder) {
    await adb.pull(source, local);
    return path.resolve(local, filename);
  }

  // The dot is for recursive copy according to
  // android.stackexchange.com/questions/87326/recursive-adb-pull
  await adb.pull(`${source}/.`, local);
  await exec(`tar -cf ${filename}.tar *`, {cwd: local});
  await exec(`gzip ${filename}.tar`, {cwd: local});
  return path.resolve(local, `${filename}.tar.gz`);
}

module.exports = () => middleware;
