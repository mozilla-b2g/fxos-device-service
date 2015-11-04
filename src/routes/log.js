let express = require('express');

let router = express.Router();

function get(req, res) {
  let {proc, output} = req.adb.logcat();
  output.pipe(res);
  req.socket.on('close', () => {
    output.unpipe(res);
    proc.kill();
  });
}

async function write(req, res) {
  let body = req.body;

  if (!body.message) {
    return res.status(500).send('Missing log message');
  }

  await req.adb.log(body.message, body.priority, body.tag);
  res.sendStatus(200);
}

router.get('/', get);
router.post('/', write);

module.exports = router;
