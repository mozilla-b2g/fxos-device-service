let adb = require('../adb');

module.exports = async function reboot(hard = true) {
  if (hard) {
    await adb.shell('reboot');
    await adb.waitForDevice();
    return;
  }

  await adb.shell('stop b2g && start b2g');
};
