module.exports = async function devices() {
  let output = await this.exec('devices');
  // Remove log lines that do not contain a tab,
  // the lines that do contain a tab describe a connected
  // device.
  return output[0]
    .split('\n')
    .filter(str => /\t/.test(str))
    .map(device => {
      let parts = device.split('\t');
      return {id: parts[0], description: parts[1]};
    });
};
