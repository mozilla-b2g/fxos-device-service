let PassThrough = require('stream').PassThrough;
let debug = console.log.bind(console, '[adb/spawn]');
let path = require('path');
let spawn = require('mz/child_process').spawn;

let adbPath = path.resolve(__dirname, '..', '..', 'bin', 'adb', process.platform);

module.exports = function spawner(spawnArgs) {
  let args = [];
  let adb = this.options.path || adbPath;

  if (!Array.isArray(spawnArgs)) {
    spawnArgs = [spawnArgs];
  }

  if (this.options.serial) {
    args.push('-s');
    args.push(this.options.serial);
  }

  if (this.options.remoteHost) {
    args.push('-H');
    args.push(this.options.remoteHost);
  }

  if (this.options.remotePort) {
    args.push('-P');
    args.push(this.options.remotePort);
  }

  args = args.concat(spawnArgs);
  debug(adb, args.join(' '));

  let proc = spawn(adb, args);
  let stream = new PassThrough();
  proc.stdout.pipe(stream);
  proc.stderr.pipe(stream);
  return {proc: proc, output: stream};
};
