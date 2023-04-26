const PROFILES = {
  supply_chain: {
    name: 'Supply Chain Security',
    description: 'Prioritizes provenance, hashes, and supplier info',
    weights: {
      'component-hashes': 0.5,
      'component-supplier': 0.4,
      'component-purl': 0.3,
      'component-attestation': 0.4,
      'component-provenance': 0.4,
      'component-trust-boundary': 0.5
    }
  },
  license_compliance: {
    name: 'License Compliance',
    description: 'Prioritizes license identification and compatibility',
    weights: {
      'component-license': 0.5,
      'license-expression': 0.4,
      'license-compatibility': 0.5,
      'component-deprecated-license': 0.3,
      'dependency-license-conflict': 0.5,
      'dependency-license-tree': 0.4
    }
  },
  minimal_viable: {
    name: 'Minimal Viable SBOM',
    description: 'Checks only the absolute essentials',
    weights: {
      'component-name': 0.5,
      'component-version': 0.5,
      'spec-version': 0.3,
      'metadata-tools': 0.2
    }
  }
};

function getProfile(name) {
  return PROFILES[name] || null;
}

function listProfiles() {
  return Object.entries(PROFILES).map(([id, p]) => ({
    id,
    name: p.name,
    description: p.description,
    checkCount: Object.keys(p.weights).length
  }));
}

function applyProfile(profile, checks) {
  const weights = profile.weights;
  return checks.map(c => ({
    ...c,
    weight: weights[c.id] !== undefined ? weights[c.id] : c.weight
  }));
}

module.exports = { getProfile, listProfiles, applyProfile, PROFILES };
