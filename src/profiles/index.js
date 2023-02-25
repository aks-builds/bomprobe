const ntia = require('./ntia');
const bsi = require('./bsi');

const profiles = { ntia, bsi };

function getProfile(name) {
  return profiles[name] || null;
}

function listProfiles() {
  return Object.keys(profiles);
}

module.exports = { getProfile, listProfiles };
