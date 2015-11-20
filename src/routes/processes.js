let express = require('express');
let fxos = require('../fxos');

let router = express.Router();

async function getAll(req, res) {
  let processes = await fxos.getProcesses(req.adb);
  res.json(processes);
}

async function getOne(req, res) {
  let proc = await fxos.getProcesses(req.adb, parseInt(req.params.pid, 10));
  res.json(proc);
}

async function kill(req, res) {
  await req.adb.kill(req.params.pid);
  res.sendStatus(200);
}

router.get('/', getAll);
router.get('/:pid', getOne);
router.delete('/:pid', kill);

module.exports = router;
