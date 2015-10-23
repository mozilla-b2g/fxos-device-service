let request = require('./request');

module.exports = function get(port, path, options = {}) {
  return request('GET', port, path, options);
};
