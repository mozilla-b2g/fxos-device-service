let debug = console.log.bind(console, '[adb/waitForDevice]');
let exec = require('mz/child_process').exec;

module.exports = function waitForDevice() {
  debug('adb wait-for-device');
  return exec('adb wait-for-device');
};
