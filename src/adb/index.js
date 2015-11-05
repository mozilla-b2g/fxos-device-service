let modularize = require('../modularize');

/**
 * Create a request-specific Adb instance by modularizing the current directory
 * @constructor
 * @param {Object} options accepts properties of:
 *   path: Specify the path to an alternate ADB binary
 *   serial: Android device serial number to target
 *   remoteHost: Connect to a device on a remote host
 *   remotePort: Connect to a device on a remote port
 */
let Adb = modularize(function Adb(options) {
  this.options = options;
}, __dirname);

module.exports = options => {
  /**
   * Bind an Adb instance as Express middleware to the request
   */
  return (req, res, next) => {
    req.adb = new Adb(Object.assign({
      serial: req.session.serial,
      remoteHost: req.session.remoteHost,
      remotePort: req.session.remotePort
    }, options));

    next();
  };
};
