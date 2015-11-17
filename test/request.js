let http = require('http');

module.exports = function request(method, port, path, options = {}) {
  return new Promise((resolve, reject) => {
    let headers = {};

    if (options.data) {
      headers['Content-Type'] = 'application/json';
    }

    let req = http.request(Object.assign({
      method: method,
      hostname: '127.0.0.1',
      port: port,
      path: path
    }, {headers}, options), res => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        res.body = body;
        resolve(res);
      });
    });

    if (options.data) {
      req.write(JSON.stringify(options.data));
    }

    req.end();
  });
};
