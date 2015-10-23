let modularize = require('../modularize');

let Fxos = modularize(function Fxos() {}, __dirname);

module.exports = new Fxos();
