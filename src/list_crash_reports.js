let uniq = require('lodash/array/uniq');
let flatten = require('lodash/array/flatten');

module.exports = async function listCrashReports(req, res) {
  let adb = req.adb;
  let [pending, submitted] = await Promise.all([
    adb.shell('ls /data/b2g/mozilla/Crash\\ Reports/pending'),
    adb.shell('ls /data/b2g/mozilla/Crash\\ Reports/submitted')
  ]);

  pending = pending[0];
  submitted = submitted[0];
  let result = uniq(
    flatten(
      [
        pending,
        submitted
      ]
      .filter(output => !/No such file or directory/.test(output))
      .map(output => {
        return output
          .split(/\s+/)
          .filter(line => !/^\s*$/.test(line))
          .map(line => line.slice(0, line.lastIndexOf('.')));
      })
    )
  );

  res.send(JSON.stringify(result));
};
