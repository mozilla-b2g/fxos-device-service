const EOL = require('os').EOL;

// Regular expression for extracting adb property output
const GETPROP_MATCHER = /^\[([\s\S]*?)]: \[([\s\S]*?)]\r?$/gm;

module.exports = async function getprop(adb, name) {
  if (name) {
    let [prop] = await adb.shell(`getprop ${name}`);
    return prop.replace(EOL, '');
  }

  let properties = {};
  let output = await adb.shell('getprop');
  let match;

  while (match = GETPROP_MATCHER.exec(output)) {
    properties[match[1]] = match[2];
  }

  return properties;
};
