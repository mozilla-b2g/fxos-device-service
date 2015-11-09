const EOL = require('os').EOL;

// Regular expression for extracting adb property output
const GETPROP_MATCHER = /^\[([\s\S]*?)]: \[([\s\S]*?)]\r?$/gm;

/**
 * Try converting an arbitrary string into a stronger JSON value
 * @param {*} value
 * @returns {*}
 */
function parse(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

/**
 * Get all or optionally a single device property
 * @param {Adb} adb Express Request.Adb instance
 * @param {string} [name] Optional single property name to fetch
 * @returns {*}
 */
module.exports = async function getprop(adb, name) {
  if (name) {
    let [prop] = await adb.shell(`getprop ${name}`);
    return parse(prop.replace(EOL, ''));
  }

  let properties = {};
  let output = await adb.shell('getprop');
  let match;

  while (match = GETPROP_MATCHER.exec(output)) {
    properties[match[1]] = parse(match[2]);
  }

  return properties;
};
