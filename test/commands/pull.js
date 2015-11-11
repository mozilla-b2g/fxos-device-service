var fs = require('fs');
var path = require('path');

var remotesToFixtures = [
  '/data/local/webapps/settings.gaiamobile.org',
  '/data/b2g/mozilla',
  '/system/b2g',
  '/system'
];

/**
 * Copy a fixture source file to a destination.
 */
module.exports = function pull(remoteSource, destination) {
  var source = path.resolve(
    __dirname, '../fixtures',
    remotesToFixtures.reduce(function(accumulator, remote) {
      return accumulator.replace(remote + '/', '');
    }, remoteSource)
  );

  if (!fs.existsSync(source)) {
    console.error("remote object '%s' does not exist", remoteSource);
    process.exit(1);
  }

  if (destination.indexOf('/') !== 0) {
    destination = path.resolve(process.cwd(), destination);
  }

  fs
    .createReadStream(source)
    .pipe(fs.createWriteStream(path.join(destination, path.basename(source))));
};
