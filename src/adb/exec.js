let debug = console.log.bind(console, '[adb/exec]');
let {exec} = require('mz/child_process');
let path = require('path');

let adbPath = path.resolve(__dirname, '..', '..', 'bin', 'adb', process.platform);
let flag = (option, value) => value ? ` ${option} ${value}` : '';

module.exports = function executor(execCmd) {
  let serial = flag('-s', this.options.serial);
  let host = flag('-H', this.options.remoteHost);
  let port = flag('-P', this.options.remotePort);
  let command = `${this.options.path || adbPath}${serial}${host}${port} ${execCmd}`;

  debug(command);
  return exec(command);
};
