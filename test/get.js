let request = require('./request');

module.exports = function get(port, path) {
  return request('GET', port, path);
};
