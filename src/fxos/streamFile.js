module.exports = function streamFile(adb, file) {
  return adb.spawn(['shell', 'cat', file]);
};
