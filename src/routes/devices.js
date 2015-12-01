let crypto = require('crypto');
let express = require('express');
let fxos = require('../fxos');
let {sessions} = require('../session');

let router = express.Router();

function createHash(data) {
  let hash = crypto.createHash('sha1');
  hash.update(JSON.stringify(data));
  return hash.digest('hex');
}

async function getAll(req, res) {
  let devices = await req.adb.devices();
  let deviceSessions = devices.map(device => {
    let newSession = Object.assign({
      serial: device.id,
      description: device.description
    }, req.session);
    let sessionId = createHash(newSession);

    newSession.id = sessionId;
    return sessions[sessionId] = newSession;
  });

  res.json(deviceSessions);
}

async function getOne(req, res) {
  let {adb} = req;

  let [info, gaiaCommit, geckoCommit] = await Promise.all([
    fxos.getDeviceInfo(adb),
    fxos.readGaiaCommit(adb),
    fxos.readGeckoCommit(adb)
  ]);

  let result = Object.assign(info, {gaia: gaiaCommit, gecko: geckoCommit});
  res.json(result);
}

router.get('/', getAll);
router.get('/:id', getOne);
router.use('/:id/connections', require('./connections'));
router.use('/:id/crashes', require('./crashes'));
router.use('/:id/events', require('./events'));
router.use('/:id/files', require('./files'));
router.use('/:id/logs', require('./logs'));
router.use('/:id/processes', require('./processes'));
router.use('/:id/profile', require('./profile'));
router.use('/:id/properties', require('./properties'));
router.use('/:id/restart', require('./restart'));

module.exports = router;
