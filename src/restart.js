let parse = require('url').parse;
let reboot = require('./fxos/reboot');

module.exports = async function restart(req, res) {
  let hard = req.query.hard === 'true' || req.query.hard === '1';
  await reboot(hard);
  res.send('200 OK');
};
