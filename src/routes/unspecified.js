let express = require('express');

let router = express.Router();

router.get('/', (req, res) => res.sendStatus(404));

module.exports = router;
