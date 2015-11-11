let debug = console.log.bind(console, '[tempdir]');
let denodeify = require('denodeify');
let tmpdir = denodeify(require('tmp').dir);

module.exports = async function tempdir() {
  let local = await tmpdir();
  debug(local);
  return local;
};
