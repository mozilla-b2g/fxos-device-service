module.exports = function findInStream(stream, predicate, {eventType = 'data'} = {}) {
  return new Promise((resolve, reject) => {
    let target;
    function end() {
      if (!target) {
        reject();
      }
    }

    stream.on('end', end);
    stream.on(eventType, function handler(item) {
      if (predicate(item)) {
        stream.removeListener(eventType, handler);
        stream.removeListener('end', end);
        return resolve(item);
      }
    });
  });
};
