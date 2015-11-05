module.exports = function kill(pid) {
  return this.shell(`kill ${pid}`);
};
