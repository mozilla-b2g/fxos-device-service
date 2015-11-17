let express = require('express');
let fxos = require('../fxos');
let moment = require('moment');

/**
 * There are two issues with `logcat -c` on Android LL
 * 1. The log buffer is not cleared
 * 2. Halts future logcat streams from outputting new content
 * The workaround is to capture a timestamp at clear, and use it in the next
 * logcat call, effectively faking a clear call
 * https://code.google.com/p/android/issues/detail?id=78916
 */
const BUGGY_SDK_VERSION = 21;
let router = express.Router();

function createTimestamp() {
  // Create a bash-formatted timestamp to cache-bust logcat on buggy Android L
  return moment().format('MM-DD HH:mm:ss.SSS');
}

async function get(req, res) {
  let adb = req.adb;
  let sdkVersion = await fxos.getSdkVersion(adb);
  let timestamp;

  if (sdkVersion >= BUGGY_SDK_VERSION) {
    timestamp = req.session.clearTimestamp || createTimestamp();
  }

  let {proc, output} = adb.logcat(timestamp);

  output.pipe(res);
  req.socket.on('close', () => {
    output.unpipe(res);
    proc.kill();
  });
}

async function write(req, res) {
  let body = req.body;

  if (!body.message) {
    return res.status(422).send('Missing log message');
  }

  await req.adb.log(body.message, body.priority, body.tag);
  res.sendStatus(200);
}

async function clear(req, res) {
  let adb = req.adb;
  let sdkVersion = await fxos.getSdkVersion(adb);

  if (sdkVersion < BUGGY_SDK_VERSION) {
    await adb.shell('logcat -c');
    return res.sendStatus(200);
  }

  req.session.clearTimestamp = createTimestamp();
  res.sendStatus(200);
}

router.get('/', get);
router.post('/', write);
router.delete('/', clear);

module.exports = router;
