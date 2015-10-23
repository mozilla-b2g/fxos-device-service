module.exports = async function reboot(adb, hard = true) {
  if (hard) {
    await adb.reboot();
    await adb.waitForDevice();
    return;
  }

  await adb.shell('stop b2g && start b2g');
};
