let fs = require('fs');
let path = require('path');
let tempdir = require('./tempdir');

function middleware(req, res, next) {
  res.sendFromDevice = async function(source) {
    let local = await tempdir();

    try {
      await req.adb.pull(source, local);
      let file = path.resolve(local, path.basename(source));
      let stream = fs.createReadStream(file);

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

module.exports = () => middleware;
