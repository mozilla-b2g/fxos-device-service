let debug = console.log.bind(console, '[adb/devices]');
let exec = require('mz/child_process').exec;

module.exports = async function devices() {
  let output = await exec('adb devices');
  let entries = output[0]
    .split('\n')
    .filter(str => !/^\s*$/.test(str));
  // Remove "List of devices attached"
  return entries
    .splice(1, entries.length)
    .map(device => {
      let parts = device.split('\t');
      return {id: parts[0], description: parts[1]};
    });
};
