let PassThrough = require('stream').PassThrough;
let debug = console.log.bind(console, '[adb/logcat]');
let spawn = require('child_process').spawn;

module.exports = function logcat() {
  debug('adb logcat');
  let proc = spawn('adb', ['logcat'], {env: process.env});
  let stream = new PassThrough();
  proc.stdout.pipe(stream);
  proc.stderr.pipe(stream);
  return {proc: proc, output: stream};
};
