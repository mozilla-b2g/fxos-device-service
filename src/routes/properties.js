let express = require('express');
let fxos = require('../fxos');

let router = express.Router();

async function getAll(req, res) {
  let properties = await fxos.getProperties(req.adb);
  res.json(properties);
}

async function getOne(req, res) {
  let property = await fxos.getProperties(req.adb, req.params.property);
  res.json(property);
}

async function set(req, res) {
  let properties = req.body;
  let keys = Object.keys(properties);
  let adb = req.adb;


  if (!keys.length) {
    return res.status(422).send('Missing map of properties');
  }

  await Promise.all(keys.map(key => {
    let value = properties[key];
    return adb.shell(`setprop ${key} ${value}`);
  }));

  res.sendStatus(200);
}

router.get('/', getAll);
router.get('/:property', getOne);
router.post('/', set);

module.exports = router;
