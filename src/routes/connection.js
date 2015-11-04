let denodeify = require('denodeify');
let emptyPort = denodeify(require('empty-port'));
let express = require('express');

let router = express.Router();

async function connect(req, res) {
  let remotePort = req.params.port;
  let hostPort = await emptyPort({startPort: 10000});
  // Forward traffic to this host on open port to whichever
  // device port the request wants.
  await req.adb.forward(hostPort, remotePort);
  res.send(hostPort.toString());
}

async function disconnect(req, res) {
  let hostPort = req.params.port;
  await req.adb.forward(hostPort, {remove: true});
  res.sendStatus(200);
}

router.post('/:port', connect);
router.delete('/:port', disconnect);

module.exports = router;
