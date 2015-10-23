module.exports = async function devices(req, res) {
  let adbDevices = await req.adb.devices();
  res.send(JSON.stringify(adbDevices));
};
