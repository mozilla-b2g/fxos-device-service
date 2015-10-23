let http = require('http');

module.exports = function request(method, port, path, options = {}) {
  return new Promise((resolve, reject) => {
    let req = http.request(Object.assign({
      method: method,
      hostname: '127.0.0.1',
      port: port,
      path: path
    }, options), res => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        res.body = body;
        resolve(res);
      });
    });

    req.end();
  });
};
