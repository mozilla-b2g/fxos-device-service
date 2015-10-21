let adb = require('./adb');
let parse = require('url').parse;

module.exports = async function restart(req, res) {
  let params = parse(req.originalUrl, true /* parseQueryString */).query;
  let hard;
  switch (params.hard) {
    case 'true':
    case '1':
      hard = true;
      break;
    case 'false':
    case '0':
    default:
      hard = false;
      break;
  }

  let command = hard ? adb.reboot() : adb.shell('stop b2g && start b2g');
  await command;
  res.send('200 OK');
};
