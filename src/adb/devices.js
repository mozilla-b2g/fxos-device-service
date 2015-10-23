module.exports = async function devices() {
  let output = await this.exec('devices');
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
