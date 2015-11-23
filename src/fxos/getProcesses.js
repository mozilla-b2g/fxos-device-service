let fs = require('fs');

const EOL = /\r\n?|\n/g;
const BOUNDARY = /\b([A-Za-z0-9_\(\)]+)/g;

function format(value) {
  value = value.trim();
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

function formatName(name) {
  return name
    .replace('_', '')
    .replace('(s)', 's')
    .toLowerCase();
}

module.exports = async function getProcesses(adb, pid) {
  let [content] = await adb.shell('b2g-info');
  let [, headings, ...lines] = content.split(EOL);
  let rows = lines.slice(0, lines.indexOf(''));
  let columns = [];
  let match;

  while (match = BOUNDARY.exec(headings)) {
    columns.push({name: match[0], index: match.index});
  }

  let procs = rows.map(row => {
    let proc = {};

    columns.forEach((column, index) => {
      let end = column.index + column.name.length;
      let name = formatName(column.name);

      // First column starts at the beginning of the string
      if (index === 0) {
        return proc[name] = format(row.slice(0, end));
      }

      // Last column is left-aligned, start at the index and go to the end
      if (index === columns.length - 1) {
        return proc[name] = format(row.slice(column.index));
      }

      // All columns but the last are right-aligned
      let previous = columns[index - 1];
      let start = previous.index + previous.name.length + 1;

      proc[name] = format(row.slice(start, end));
    });

    return proc;
  });

  if (pid) {
    return procs.find(proc => proc.pid === pid);
  }

  return procs;
};

