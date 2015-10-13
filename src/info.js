let adb = require('./adb');
let readGaiaCommit = require('./fxos/read_gaia_commit');

module.exports = async function info(req, res) {
  let [devices, commit] = await Promise.all([
    adb.devices(),
    readGaiaCommit()
  ]);

  let result = Object.assign({}, {device: devices[0]}, {commit: commit});
  res.send(JSON.stringify(result));
};
