let adb = require('../adb');
let assert = require('assert');
let debug = console.log.bind(console, '[fxos/read_gaia_commit]');
let denodeify = require('denodeify');
let exec = require('mz/child_process').exec;
let fs = require('mz/fs');
let tmpdir = denodeify(require('tmp').dir);

let roots = ['/data/local/', '/system/b2g/'];

module.exports = async function readGaiaCommit() {
  let local = await tmpdir();
  debug('tmpdir', local);
  await Promise.all(
    roots.map(async function(root) {
      try {
        await adb.pull(`${root}/webapps/settings.gaiamobile.org/application.zip`, local);
      } catch (error) {
        if (/remote object '.+' does not exist/.test(error.message)) {
          // This just means we didn't find the zipball in one of the path candidates.
          return;
        }

        throw error;
      }
    })
  );

  let exists = await fs.exists(`${local}/application.zip`);
  assert(exists, 'Failed to pull settings/gaiamobile.org/application.zip from device.');

  debug('unzip application.zip');
  await exec('unzip application.zip', {cwd: local});
  let commit = await fs.readFile(`${local}/resources/gaia_commit.txt`);
  let parts = commit
    .toString()
    .split('\n');
  return {sha: parts[0], timestamp: parts[1]};
};
