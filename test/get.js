let http = require('http');

module.exports = function get(url) {
  return new Promise((resolve, reject) => {
    let req = http.get(url, res => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        res.body = body;
        resolve(res);
      });
    });

    req.on('error', reject);
  });
};
