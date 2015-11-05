let path = require('path');
let service = require('../../src/service');
let tcpPortUsed = require('tcp-port-used');

setup(async function() {
  service.start({
    port: 3000,
    // Make sure that our fake adb gets used instead of the real thing.
    adbPath: path.resolve(__dirname, '../adb')
  });

  await tcpPortUsed.waitUntilUsed(3000);
});

teardown(async function() {
  service.stop();
  await tcpPortUsed.waitUntilFree(3000);
});
