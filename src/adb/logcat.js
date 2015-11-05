module.exports = function logcat(timestamp) {
  let args = ['logcat'];

  if (timestamp) {
    args.push('-T', timestamp);
  }

  return this.spawn(args);
};
