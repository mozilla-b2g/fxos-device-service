var fs = require('fs');
var ncp = require('ncp').ncp;
var path = require('path');

// List out the remote locations on device which will be resolved into the
// test fixtures directory
var remotePathsForLocalFixtures = [
  '/data/local/webapps/settings.gaiamobile.org',
  '/data/b2g/mozilla',
  '/system/b2g',
  '/system'
];

/**
 * Copy a fixture source file to a destination.
 */
module.exports = function pull(remoteSource, destination) {
  var isRecursive = remoteSource.slice(-1) === '.';
  var source = path.resolve(
    __dirname, '../fixtures',
    // In the remote source, replace any entry in our fixture mapping with an
    // empty string so it will resolve into the fixtures directory
    // e.g. "/system/b2g/application.ini" will have the "/system/b2g/" removed,
    // leaving just application.ini to be resolved in the fixtures directory
    remotePathsForLocalFixtures.reduce(function(accumulator, remote) {
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

  if (isRecursive) {
    ncp(source, destination, function(err) {
      if (err) {
        throw err;
      }
    });
  } else {
    var reader = fs.createReadStream(source);
    var writer = fs.createWriteStream(
      path.join(
        destination,
        path.basename(source)
      )
    );

    reader.pipe(writer);
  }
};
