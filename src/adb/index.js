let basename = require('path').basename;
let fs = require('fs');

fs.readdirSync(__dirname)
  .filter(filename => !__filename.endsWith(filename))
  .map(filename => basename(filename, '.js'))  // remove file extension
  .forEach(moduleName => exports[moduleName] = require(`./${moduleName}`));
