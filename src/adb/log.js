module.exports = function log(message, priority = 'i', tag = 'DeviceService') {
  return this.shell(`log -p ${priority} -t ${tag} "${message}"`);
};
