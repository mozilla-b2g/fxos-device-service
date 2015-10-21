let debug = console.log.bind(console, '[adb/pull]');
let exec = require('mz/child_process').exec;

module.exports = function reboot() {
  debug('adb reboot');
  return exec('adb reboot');
};
