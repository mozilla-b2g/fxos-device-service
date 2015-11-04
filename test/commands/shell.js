var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

function noop() {}
function stream(command, location) {
  location = location
    .replace('/data/b2g/mozilla/', '')
    .replace('\\', '');
  location = path.resolve(__dirname, '..', 'fixtures', location);

  var child = spawn(command, [location]);

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
}

var commands = {};

commands.cat = function cat(file) {
  return stream('cat', file);
};

commands.ls = function ls(dir) {
  return stream('ls', dir);
};

commands.reboot = noop;
commands.start = noop;
commands.stop = noop;
commands.kill = noop;
commands.log = noop;

module.exports = function shell(arg0) {
  if (!arg0) {
    return;
  }

  if (arg0.indexOf("'") === 0 && arg0.indexOf("'") === 0) {
    arg0 = arg0.slice(1, -1);
  }

  var argv = arg0
    .replace(/\\ /g, '<@>')
    .split(/\s+/)
    .map(function(item) { return item.replace(/<@>/g, '\\ '); });
  var command = argv.shift();

  if (!commands[command]) {
    return;
  }

  return commands[command].apply(null, argv);
};
