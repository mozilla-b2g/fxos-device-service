let fxos = require('./fxos');

module.exports = async function device(req, res) {
  let adb = req.adb;

  if (req.params.id) {
    adb.options.serial = req.params.id;
  }

  let [gaiaCommit, geckoCommit] = await Promise.all([
    fxos.readGaiaCommit(adb),
    fxos.readGeckoCommit(adb)
  ]);

  let result = {gaia: gaiaCommit, gecko: geckoCommit};
  res.json(result);
};
