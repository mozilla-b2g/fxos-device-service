let assert = require('assert');
let debug = console.log.bind(console, '[fxos/readGeckoCommit]');
let findInStream = require('../findInStream');
let fs = require('mz/fs');
let path = require('path');
let sax = require('sax');
let tempdir = require('../tempdir');

const SOURCES_XML = '/system/sources.xml';
const APPLICATION_INI = '/system/b2g/application.ini';
const PLATFORM_INI = '/system/b2g/platform.ini';

async function pullIniFile(adb, local, file) {
  await adb.pull(file, local);
  return path.join(local, path.basename(file));
}

function matchSourceStamp(item) {
  return item
    .split('\n')
    .find(line => line.includes('SourceStamp'));
}

async function readGeckoRevisionFromIni(iniFile) {
  let stream = fs.createReadStream(iniFile, {encoding: 'utf8'});
  let line = await findInStream(stream, matchSourceStamp);

  return matchSourceStamp(line).split('=')[1];
}

async function getGeckoRevisionFromIni(adb, local) {
  let iniFile;

  await Promise.all([APPLICATION_INI, PLATFORM_INI].map(async function(file) {
    try {
      iniFile = await pullIniFile(adb, local, file);
    } catch (error) {}
  }));

  if (!iniFile) {
    throw new Error('Error pulling INI file');
  }

  return await readGeckoRevisionFromIni(iniFile);
}

async function getGeckoRevisionFromXml(local) {
  let stream = fs.createReadStream(local).pipe(sax.createStream());
  let node = await findInStream(stream, node => {
    // The Gecko revision lives in a tag that MAY be HTML-commented
    return node.name === 'PROJECT' && node.attributes.NAME === 'gecko';
  }, {eventType: 'opentag'});

  return node.attributes.REVISION;
}

/**
 * Fetch a Gecko revision from either sources.xml, application.ini, or
 * platform.ini
 * @param {Adb} adb Request-specific Adb instance
 * @returns {string}
 */
module.exports = async function getGeckoRevision(adb) {
  let local = await tempdir();

  try {
    await adb.pull(SOURCES_XML, local);
    let file = path.join(local, path.basename(SOURCES_XML));
    return await getGeckoRevisionFromXml(file);
  } catch (error) {
    return await getGeckoRevisionFromIni(adb, local);
  }
};
