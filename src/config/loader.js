const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');
const { validateConfig } = require('./schema');
const { mergeConfig } = require('../utils/configMerge');

const CONFIG_FILENAMES = ['.bomprobe.json', '.bomproberc', 'bomprobe.config.json'];

function findConfigFile(dir) {
  for (const name of CONFIG_FILENAMES) {
    const path = join(dir, name);
    if (existsSync(path)) return path;
  }
  return null;
}

function loadConfig(dir) {
  const path = findConfigFile(dir);
  if (!path) return { config: {}, path: null };

  try {
    const raw = readFileSync(path, 'utf-8');
    const config = JSON.parse(raw);
    const validation = validateConfig(config);
    if (!validation.valid) {
      return { config: null, path, errors: validation.errors };
    }
    return { config, path };
  } catch (err) {
    return { config: null, path, errors: [`Failed to load config: ${err.message}`] };
  }
}

function resolveConfig(fileConfig, cliFlags) {
  const defaults = { format: 'text', threshold: 0 };
  return mergeConfig(defaults, fileConfig || {}, cliFlags || {});
}

module.exports = { findConfigFile, loadConfig, resolveConfig, CONFIG_FILENAMES };
