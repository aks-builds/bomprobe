const ntia = require('./ntia');
const bsi = require('./bsi');
const { createProfile } = require('./custom');
const { getConfig } = require('../config');

const builtins = { ntia, bsi };

function getProfile(name) {
  if (builtins[name]) return builtins[name];

  const config = getConfig();
  if (config && config.profiles && config.profiles[name]) {
    return createProfile(name, config.profiles[name]);
  }

  return null;
}

function listProfiles() {
  const config = getConfig();
  const custom = config && config.profiles ? Object.keys(config.profiles) : [];
  return [...Object.keys(builtins), ...custom];
}

module.exports = { getProfile, listProfiles };
