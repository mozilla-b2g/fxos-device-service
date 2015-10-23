var fs = require('fs');
var path = require('path');

/**
 * Copy a fixture source file to a destination.
 */
module.exports = function pull(source, destination) {
  source = path.resolve(__dirname, '..', 'fixtures', path.basename(source));

  if (destination.indexOf('/') !== 0) {
    destination = path.resolve(process.cwd(), destination);
  }

  fs
    .createReadStream(source)
    .pipe(fs.createWriteStream(path.join(destination, path.basename(source))));
};
