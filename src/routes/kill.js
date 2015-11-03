let express = require('express');

let router = express.Router();

async function kill(req, res) {
  await req.adb.kill(req.params.pid);
  res.send('200 OK');
};

router.post('/:pid', kill);

module.exports = router;
