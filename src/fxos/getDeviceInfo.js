const EOL = /\r\n?|\n/;
const DIMENSION_KEY = 'ABS_MT_POSITION_';
const INPUT_EVENT_KEY = 'add device';

function getInputIndices(lines) {
  return lines.reduce((arr, line, index) => {
    if (line.includes(DIMENSION_KEY)) {
      arr.push(index);
    }
    return arr;
  }, []);
}

function getInputEvent(lines) {
  return lines
    .find(line => line.includes(INPUT_EVENT_KEY))
    .split(': ')[1];
}

function getDimensions(lines, indices) {
  let matcher = /max (.*),/;
  return indices
    .map(index => parseInt(matcher.exec(lines[index])[1], 10))
    .reverse();
}

module.exports = async function getDeviceInfo(adb) {
  let props = await this.getProperties(adb);
  let [content] = await adb.shell('getevent -lp');
  let lines = content.split(EOL).reverse();
  let indices = getInputIndices(lines);
  let density = +props['qemu.sf.lcd_density'] || +props['ro.sf.lcd_density'];

  return {
    density,
    dimensions: getDimensions(lines, indices),
    inputEvent: getInputEvent(lines.slice(indices[1])),
    pixelRatio: density / 160
  };
};
