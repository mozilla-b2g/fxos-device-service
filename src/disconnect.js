let adb = require('./adb');

module.exports = async function disconnect(req, res) {
  let hostPort = req.params.port;
  await adb.forward(hostPort, {remove: true});
  res.send('200 OK');
};
