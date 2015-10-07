let adb = require('./adb');

module.exports = function log(req, res) {
  let {proc, output} = adb.logcat();
  output.pipe(res);
  req.socket.on('close', () => {
    output.unpipe(res);
    proc.kill();
  });
};
