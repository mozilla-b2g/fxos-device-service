module.exports = function pull(source, dest) {
  return this.exec(`pull ${source} ${dest}`);
};
