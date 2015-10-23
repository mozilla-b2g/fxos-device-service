let fs = require('fs');
let path = require('path');

module.exports = function(ctor, dir) {
  fs.readdirSync(dir)
    .filter(filename => !__filename.endsWith('index.js'))
    .forEach(filename => {
      let basename = path.basename(filename, '.js');
      ctor.prototype[basename] = require(path.join(dir, filename));
    });

  return ctor;
};
