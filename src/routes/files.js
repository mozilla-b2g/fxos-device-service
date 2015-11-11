let express = require('express');
let fxos = require('../fxos');
let multer = require('multer');
let path = require('path');

let router = express.Router();
let storage = multer({storage: multer.diskStorage({filename})});
let middleware = storage.any();

function filename(req, file, done) {
  done(null, path.basename(req.query.filepath));
}

function filepath(req, res, next) {
  if (!req.query.filepath) {
    res.status(422).send('Missing filepath parameter');
  } else {
    next();
  }
}

function uploader(req, res, next) {
  middleware(req, res, err => {
    if (err) {
      return res.status(500).send('File upload failed');
    }

    if (!req.files || !req.files.length || !req.files[0]) {
      return res.status(422).send('No file uploaded');
    }

    next();
  });
}

function download(req, res) {
  let {proc, output} = fxos.streamFile(req.adb, req.query.filepath);

  // If the file isn't found, for some reason the error is output on stdout :(
  // Listen for the first bit of data, and if it's really the error, send it
  proc.stdout.once('data', data => {
    if (/No such file or directory/.test(data)) {
      return res.sendStatus(404);
    }

    output.pipe(res);
    req.socket.on('close', () => {
      output.unpipe(res);
      proc.kill();
    });
  });
}

async function upload(req, res) {
  let adb = req.adb;
  let source = req.files[0].path;
  let destination = req.query.filepath;
  let mode = req.body.mode;

  await adb.push(source, destination);

  if (!mode) {
    return res.sendStatus(200);
  }

  let [output] = await fxos.setFilePermissions(adb, destination, mode);

  if (/Bad mode/.test(output)) {
    return res.status(500).send('Invalid file permissions mode used');
  }

  return res.sendStatus(200);
}

router.get('/', filepath, download);
router.put('/', filepath, uploader, upload);

module.exports = router;
