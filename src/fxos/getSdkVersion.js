module.exports = async function getSdkVersion(adb) {
  return this.getProperties(adb, 'ro.build.version.sdk');
};
