let crypto = require('crypto');

let sessions = {};

function hydrate(request, sessionId) {
  let session = sessions[sessionId];

  Object.assign(request, session, { sessionId });
}

function createHash(data) {
  let hash = crypto.createHash('sha1');
  hash.update(JSON.stringify(data));
  return hash.digest('hex');
}

function middleware(req, res, next) {
  let sessionId = req.get('X-Session-Id');

  if (!sessionId) {
    let session = {
      serial: req.get('X-Android-Serial'),
      remoteHost: req.get('X-Remote-Host'),
      remotePort: req.get('X-Remote-Port')
    };
    sessionId = createHash(session);
    sessions[sessionId] = session;
  }

  hydrate(req, sessionId);

  res.setHeader('X-Session-Id', sessionId);
  next();
}

module.exports = () => middleware;
