let {createWriteStream} = require('fs');
let debug = console.log.bind(console, '[routes/profile]');
let eventToPromise = require('event-to-promise');
let {exec} = require('mz/child_process');
let express = require('express');
let reboot = require('../fxos/reboot');
let tempdir = require('../tempdir');

let router = express.Router();

async function download(req, res) {
  let {adb} = req;
  let profile = await findProfile(adb);
  debug('profile', profile);
  res.sendFromDevice(`/data/b2g/mozilla/${profile}`, {isFolder: true});
}

async function upload(req, res) {
  let {adb} = req;
  let [dir, profile] = await Promise.all([
    tempdir(),
    findProfile(adb)
  ]);

  debug('profile', profile);

  // Delete the existing profile on device.
  let deleteProfile = adb.shell(`rm -rf /data/b2g/mozilla/${profile}`);

  // Stream the file upload to host disk.
  let filename = `${dir}/${profile}.tar.gz`;
  debug('Store new profile on host...', filename);
  req.pipe(createWriteStream(filename));
  await eventToPromise(req, 'end');
  debug('Finished writing profile to disk');

  // Open the tarball.
  await exec(`tar -xf ${profile}.tar.gz`, {cwd: dir});

  debug('Preparing to send profile to device');
  await deleteProfile;

  // Recursively copy the opened archive to the profile location.
  await adb.push(`${dir}/.`, `/data/b2g/mozilla/${profile}`);

  // Finally reboot b2g process with the new profile.
  await reboot(adb, false /* hard */);
  res.sendStatus(200);
}

async function findProfile(adb) {
  let [output] = await adb.shell('ls /data/b2g/mozilla/');
  let match = /([^\s]+\.default)/g.exec(output);
  return Array.isArray(match) ? match[0] : match;
}

router.get('/', download);
router.post('/', upload);

module.exports = router;
