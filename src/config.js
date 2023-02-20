const fs = require('node:fs');
const path = require('node:path');

const CONFIG_NAME = '.bomproberc';

function findConfig(startDir) {
  let dir = startDir || process.cwd();
  while (true) {
    const candidate = path.join(dir, CONFIG_NAME);
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function loadConfig(filePath) {
  if (!filePath) return {};
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function getConfig(startDir) {
  const configPath = findConfig(startDir);
  return loadConfig(configPath);
}

module.exports = { findConfig, loadConfig, getConfig };
