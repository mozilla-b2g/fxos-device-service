let device = require('../device');
let express = require('express');

let router = express.Router();

async function devices(req, res) {
  let adbDevices = await req.adb.devices();
  res.json(adbDevices);
}

router.get('/', devices);
router.get('/:id', device);

module.exports = router;
