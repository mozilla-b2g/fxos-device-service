var path = require('path');
var child = require('child_process');

function remove(arg) {
  var port = arg.split(':')[1];
  var command = "kill $(lsof -i :" + port + " | awk 'NR>1{ print $2; }')";
  child.exec(command);
}

function create(arg) {
  child.spawn(path.resolve(__dirname, '../echo_server'), [arg.split(':')[1]], {
    cwd: path.resolve(__dirname, '..'),
    detached: true,
    stdio: ['ignore', 'ignore', 'ignore']
  }).unref();
}

/**
 * We'll get something that either looks like
 *
 *   adb forward tcp:xxxx tcp:xxxx
 *   adb forward --remove tcp:xxxx
 *
 * In the first case, we can fake it by bringing up a tcp server
 * on the parameter port.
 *
 * In the second case, we can fake it by killing any processes listening
 * for traffic on the parameter port.
 */
module.exports = function forward(arg0, arg1) {
  arg0 === '--remove' ?
    remove(arg1) :
    create(arg0);
};
