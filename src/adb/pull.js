let debug = console.log.bind(console, '[adb/pull]');
let exec = require('mz/child_process').exec;

module.exports = function pull(source, dest) {
  let cmd = `adb pull ${source} ${dest}`;
  debug(cmd);
  return exec(cmd);
};
