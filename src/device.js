let fxos = require('./fxos');

module.exports = async function device(req, res) {
  let adb = req.adb;

  if (req.params.id) {
    adb.options.serial = req.params.id;
  }

  let [gaiaCommit] = await Promise.all([
    fxos.readGaiaCommit(adb)
  ]);

  let result = Object.assign({}, {gaia: gaiaCommit});
  res.json(result);
};
