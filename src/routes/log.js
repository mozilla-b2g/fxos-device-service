let express = require('express');

let router = express.Router();

function log(req, res) {
  let {proc, output} = req.adb.logcat();
  output.pipe(res);
  req.socket.on('close', () => {
    output.unpipe(res);
    proc.kill();
  });
}

router.get('/', log);

module.exports = router;
