var fs = require('fs');
var path = require('path');

/**
 * Print fake device info to console.
 */
module.exports = function devices() {
  fs
    .createReadStream(path.resolve(__dirname, '../output/devices'))
    .pipe(process.stdout);
};
