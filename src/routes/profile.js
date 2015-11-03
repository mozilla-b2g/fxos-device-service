let express = require('express');

let router = express.Router();

function profile(req, res) {
  // TODO
  res.sendStatus(501);
}

router.post('/', profile);

module.exports = router;
