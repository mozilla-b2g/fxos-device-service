var fs = require('fs');
var path = require('path');

/**
 * Stream sample logcat data to stdout.
 */
module.exports = function logcat() {
  fs
    .createReadStream(path.resolve(__dirname, '../output/logcat'))
    .pipe(process.stdout);

  setInterval(function() {
    console.log('V/WLAN_PSA(  209): NL MSG, len[048], NL type[0x11] WNI type[0x5050] len[028]');

    if (this.serial) {
      console.log('I/ANDROID_SERIAL(  000): ' + this.serial);
    }
  }.bind(this), 100);
};
