/**
 * Set the read-write permissions of a file on device
 * @param {Adb} adb Request-specific Adb instance
 * @param {string} file
 * @param {*} permission system permission mode
 * @returns {*}
 */
module.exports = function setFilePermissions(adb, file, permission) {
  return adb.shell(`chmod ${permission} ${file}`);
};
