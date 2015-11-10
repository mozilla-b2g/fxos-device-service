var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

// Regular expression for extracting adb property output
const GETPROP_MATCHER = /^\[([\s\S]*?)]: \[([\s\S]*?)]\r?$/gm;

function noop() {}
function parse(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}
function stream(command, location) {
  location = location
    .replace('/data/b2g/mozilla/', '')
    .replace('\\', '');
  location = path.resolve(__dirname, '..', 'fixtures', location);

  var child = spawn(command, [location]);

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  return child;
}

var commands = {};

commands.cat = function cat(file) {
  var proc = stream('cat', file);

  proc.stderr.once('data', function(data) {
    if (/No such file or directory/.test(data.toString())) {
      console.log(data.toString());
      process.exit(1);
    }
  });

  return proc;
};

commands.ls = function ls(dir) {
  return stream('ls', dir);
};

commands.getprop = function getprop(name) {
  var output = path.resolve(__dirname, '../output/getprop');
  var readStream = fs.createReadStream(output, {encoding: 'utf8'});

  if (!name) {
    return readStream.pipe(process.stdout);
  }

  var content = '';

  readStream.on('data', function(data) { content += data; });
  readStream.on('end', function() {
    var match;

    while (match = GETPROP_MATCHER.exec(content)) {
      if (match[1] !== name) {
        continue;
      }

      console.log(parse(match[2]));
      return;
    }
  });
};

commands.chmod = function chmod(mode, file) {
  // Super-dirty mode validity check
  if (!/^\d+$/.test(mode) && !/[\+\-=]/.test(mode)) {
    console.log('Bad mode');
  }
};

commands.reboot = noop;
commands.start = noop;
commands.stop = noop;
commands.kill = noop;
commands.log = noop;
commands.setprop = noop;

module.exports = function shell() {
  var args = Array.prototype.slice.call(arguments).join(' ');

  if (!args) {
    return;
  }

  if (args.indexOf("'") === 0 && args.lastIndexOf("'") === args.length - 1) {
    args = args.slice(1, -1);
  }

  var argv = args
    .replace(/\\ /g, '<@>')
    .split(/\s+/)
    .map(function(item) { return item.replace(/<@>/g, '\\ '); });
  var command = argv.shift();

  if (!commands[command]) {
    return;
  }

  return commands[command].apply(null, argv);
};
