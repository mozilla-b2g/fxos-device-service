let fxos = require('./fxos');

module.exports = async function device(req, res) {
  let adb = req.adb;

  if (req.params.id) {
    adb.options.serial = req.params.id;
  }

  let [info, gaiaCommit, geckoCommit] = await Promise.all([
    fxos.getDeviceInfo(adb),
    fxos.readGaiaCommit(adb),
    fxos.readGeckoCommit(adb)
  ]);

  let result = Object.assign(info, {gaia: gaiaCommit, gecko: geckoCommit});
  res.json(result);
};
