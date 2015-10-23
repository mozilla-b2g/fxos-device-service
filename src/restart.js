let fxos = require('./fxos');

module.exports = async function restart(req, res) {
  let hard = req.query.hard === 'true' || req.query.hard === '1';
  await fxos.reboot(req.adb, hard);
  res.send('200 OK');
};
