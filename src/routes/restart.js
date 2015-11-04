let express = require('express');
let fxos = require('../fxos');

let router = express.Router();

async function restart(req, res) {
  let hard = req.query.hard === 'true' || req.query.hard === '1';
  await fxos.reboot(req.adb, hard);
  res.sendStatus(200);
}

router.post('/', restart);

module.exports = router;
