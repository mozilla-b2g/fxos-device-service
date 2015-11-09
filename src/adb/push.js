module.exports = function push(source, dest) {
  return this.exec(`push ${source} ${dest}`);
};
