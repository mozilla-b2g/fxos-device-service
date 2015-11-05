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
    args.push('-s', this.options.serial);
  }

  if (this.options.remoteHost) {
    args.push('-H', this.options.remoteHost);
  }

  if (this.options.remotePort) {
    args.push('-P', this.options.remotePort);
  }

  args.push(...spawnArgs);
  debug(adb, args.join(' '));

  let proc = spawn(adb, args);
  let stream = new PassThrough();
  proc.stdout.pipe(stream);
  proc.stderr.pipe(stream);
  return {proc: proc, output: stream};
};
