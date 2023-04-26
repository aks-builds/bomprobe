const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');

const CONFIG_FILENAMES = ['.bomproberc', '.bomproberc.json', 'bomprobe.config.json'];

function findConfigFile(dir) {
  for (const name of CONFIG_FILENAMES) {
    const full = join(dir, name);
    if (existsSync(full)) return full;
  }
  return null;
}

function loadConfigFile(dir) {
  const path = findConfigFile(dir);
  if (!path) return null;

  const raw = readFileSync(path, 'utf8');
  const config = JSON.parse(raw);
  return config;
}

function mergeConfigs(fileConfig, cliConfig) {
  const merged = { ...fileConfig };

  for (const [key, val] of Object.entries(cliConfig)) {
    if (val !== undefined && val !== null) {
      merged[key] = val;
    }
  }

  return merged;
}

module.exports = { findConfigFile, loadConfigFile, mergeConfigs, CONFIG_FILENAMES };
