const SESSION_ID_MATCHER = /^\/devices\/(.+?)(\/|$)/;
let sessions = {};

function middleware(req, res, next) {
  let matches = SESSION_ID_MATCHER.exec(req.url);
  let sessionId = matches ? matches[1] : '';
  let session = sessions[sessionId];

  if (!session || !sessionId) {
    session = sessions[sessionId] = {
      remoteHost: req.query.host,
      remotePort: req.query.port
    };
  }

  req.session = session;
  next();
}

module.exports = () => middleware;
module.exports.sessions = sessions;
