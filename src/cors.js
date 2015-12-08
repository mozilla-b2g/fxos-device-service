function middleware(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
}

module.exports = () => middleware;
