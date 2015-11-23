let express = require('express');
let fxos = require('../fxos');
let path = require('path');

const REMOTE_ORNG_PATH = '/data/local/orng';
const REMOTE_SCRIPT_PATH = '/data/local/tmp/orng-cmd';

let commands = {
  doubletap: c => `tap ${c.x} ${c.y} 2 1`,
  drag: c => `drag ${c.x} ${c.y} ${c.endX} ${c.endY} 10 ${c.duration}`,
  keydown: c => `keydown ${c.code}`,
  keyup: c => `keyup ${c.code}`,
  reset: c => 'reset',
  sleep: c => `sleep ${c.duration}`,
  tap: c => `tap ${c.x} ${c.y} 1 1`
};
let router = express.Router();

function delay(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function init(req, res, next) {
  if (req.session.deviceInfo) {
    return next();
  }

  let adb = req.adb;
  let sdkVersion = await fxos.getSdkVersion(adb);
  let binary = sdkVersion >= 16 ? 'orng.pie' : 'orng';
  let source = path.join(`${__dirname}/../../bin/${binary}`);

  await adb.push(source, REMOTE_ORNG_PATH);
  await fxos.setFilePermissions(adb, REMOTE_ORNG_PATH, 777);
  req.session.deviceInfo = await fxos.getDeviceInfo(adb);
  next();
}

async function trigger({adb, session}, command) {
  // Cache the command so subsequent requests for the same event can skip
  // creation of the orangutan script
  if (session.eventCommand !== command) {
    await adb.shell(`echo "${command}" > ${REMOTE_SCRIPT_PATH}`);
    session.eventCommand = command;
  }

  let {inputEvent} = session.deviceInfo;
  await delay(250);
  return adb.shell(`${REMOTE_ORNG_PATH} ${inputEvent} ${REMOTE_SCRIPT_PATH}`);
}

async function fireOne(req, res) {
  let {event} = req.params;
  let eventCommand = commands[event];

  if (!eventCommand) {
    return res.status(422).send('Invalid event trigger type');
  }

  let command = eventCommand(req.body);

  if (command.includes('undefined')) {
    return res.status(422).send('Invalid event type parameters');
  }

  await trigger(req, command);
  res.sendStatus(200);
}

async function fireMany(req, res) {
  let events = req.body;

  if (!events.length) {
    return res.status(422).send('Missing events to trigger');
  }

  let command = events.map(e => commands[e.event](e)).join('; ');

  if (command.includes('undefined')) {
    return res.status(422).send('Invalid event type parameters');
  }

  await trigger(req, command);
  res.sendStatus(200);
}

router.post('/', init, fireMany);
router.post('/:event', init, fireOne);

module.exports = router;
