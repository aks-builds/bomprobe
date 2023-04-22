const { readFileSync, watchFile, unwatchFile } = require('node:fs');
const { resolve } = require('node:path');

function createWatcher(filePath, callback, options = {}) {
  const resolvedPath = resolve(filePath);
  const interval = options.interval || 2000;
  let lastMtime = 0;

  function check() {
    try {
      const content = readFileSync(resolvedPath, 'utf8');
      const sbom = JSON.parse(content);
      callback(null, sbom, resolvedPath);
    } catch (err) {
      callback(err, null, resolvedPath);
    }
  }

  function onChange(curr) {
    if (curr.mtimeMs !== lastMtime) {
      lastMtime = curr.mtimeMs;
      check();
    }
  }

  process.nextTick(check);
  watchFile(resolvedPath, { interval }, onChange);

  return {
    close() {
      unwatchFile(resolvedPath, onChange);
    }
  };
}

function formatWatchHeader(filePath, timestamp) {
  const time = timestamp || new Date().toLocaleTimeString();
  return `[${time}] Scanning ${filePath}...`;
}

module.exports = { createWatcher, formatWatchHeader };
