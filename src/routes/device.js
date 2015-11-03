let device = require('../device');
let express = require('express');

let router = express.Router();

router.get('/', device);

module.exports = router;
