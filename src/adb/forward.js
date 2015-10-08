let debug = console.log.bind(console, '[adb/forward]');
let exec = require('mz/child_process').exec;

module.exports = function forward(hostPort, remotePort, options = {}) {
  if (typeof remotePort === 'object') {
    options = remotePort;
    remotePort = null;
  }

  let cmd = 'adb forward';
  if (options.remove) {
    cmd += ` --remove tcp:${hostPort}`;
  } else {
    cmd += ` tcp:${hostPort} tcp:${remotePort}`;
  }

  debug(cmd);
  return exec(cmd);
};
