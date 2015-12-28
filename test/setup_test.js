let chai = require('chai');
let path = require('path');
let service = require('../src/service');
let tcpPortUsed = require('tcp-port-used');

suiteSetup(async function() {
  chai.should();

  service.start({
    port: 3000,
    // Make sure that our fake adb gets used instead of the real thing.
    adbPath: path.resolve(__dirname, './adb')
  });

  await tcpPortUsed.waitUntilUsed(3000);
});

suiteTeardown(async function() {
  service.stop();
  await tcpPortUsed.waitUntilFree(3000);
});
