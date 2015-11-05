module.exports = function shell(shellCmd) {
  return this.exec(`shell '${shellCmd}'`);
};
