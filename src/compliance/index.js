const { checkNtia } = require('./ntia');
const { checkEuCra } = require('./eucra');
const { checkBsiTr } = require('./bsitr');

const PROFILES = {
  ntia: checkNtia,
  eucra: checkEuCra,
  'eu-cra': checkEuCra,
  bsitr: checkBsiTr,
  'bsi-tr-03183': checkBsiTr
};

function checkCompliance(sbom, profileName) {
  const fn = PROFILES[profileName?.toLowerCase()];
  if (!fn) return { error: `Unknown compliance profile: ${profileName}. Available: ${Object.keys(PROFILES).join(', ')}` };
  return fn(sbom);
}

function checkAllProfiles(sbom) {
  return [checkNtia(sbom), checkEuCra(sbom), checkBsiTr(sbom)];
}

function listProfiles() {
  return [
    { id: 'ntia', name: 'NTIA Minimum Elements', description: 'US NTIA minimum SBOM elements' },
    { id: 'eucra', name: 'EU Cyber Resilience Act', description: 'EU CRA SBOM requirements' },
    { id: 'bsitr', name: 'BSI TR-03183', description: 'German Federal Office for Information Security technical guideline' }
  ];
}

module.exports = { checkCompliance, checkAllProfiles, listProfiles };
