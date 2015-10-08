let adb = require('./adb');
let denodeify = require('denodeify');
let emptyPort = denodeify(require('empty-port'));

module.exports = async function connect(req, res) {
  let remotePort = req.params.port;
  let hostPort = await emptyPort({startPort: 10000});
  // Forward traffic to this host on open port to whichever
  // device port the request wants.
  await adb.forward(hostPort, remotePort);
  res.send(hostPort.toString());
};
