let adb = require('../adb');
let debug = console.log.bind(console, '[fxos/read_gaia_commit]');
let denodeify = require('denodeify');
let exec = require('mz/child_process').exec;
let readFile = require('mz/fs').readFile;
let tmpdir = denodeify(require('tmp').dir);

module.exports = async function readGaiaCommit() {
  let local = await tmpdir();
  debug('tmpdir', local);
  await adb.pull(
    '/system/b2g/webapps/settings.gaiamobile.org/application.zip',
    local
  );

  debug('unzip application.zip');
  await exec('unzip application.zip', {cwd: local});
  let commit = await readFile(`${local}/resources/gaia_commit.txt`);
  let parts = commit
    .toString()
    .split('\n');
  return {sha: parts[0], timestamp: parts[1]};
};
