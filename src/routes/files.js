let express = require('express');
let fs = require('fs');
let fxos = require('../fxos');
let multer = require('multer');
let path = require('path');
let tempdir = require('../tempdir');

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

async function download(req, res) {
  res.sendFromDevice(req.query.filepath);
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
