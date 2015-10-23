module.exports = function forward(hostPort, remotePort, options = {}) {
  if (typeof remotePort === 'object') {
    options = remotePort;
    remotePort = null;
  }

  let cmd = 'forward';
  if (options.remove) {
    cmd += ` --remove tcp:${hostPort}`;
  } else {
    cmd += ` tcp:${hostPort} tcp:${remotePort}`;
  }

  return this.exec(cmd);
};
