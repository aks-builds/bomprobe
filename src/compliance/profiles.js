const PROFILES = {
  ntia: {
    name: 'NTIA Minimum Elements',
    description: 'NTIA minimum elements for SBOM as defined in July 2021 guidance',
    requiredChecks: [
      'component-name',
      'component-version',
      'component-supplier',
      'metadata-author',
      'metadata-timestamp',
      'dependency-coverage',
      'unique-purls'
    ]
  },
  bsi: {
    name: 'BSI TR-03183',
    description: 'German Federal Office for Information Security technical guideline',
    requiredChecks: [
      'component-name',
      'component-version',
      'component-supplier',
      'component-license',
      'component-purl',
      'component-hashes',
      'metadata-author',
      'metadata-timestamp',
      'metadata-tools',
      'dependency-coverage',
      'unique-purls',
      'component-copyright'
    ]
  },
  cra: {
    name: 'EU Cyber Resilience Act',
    description: 'European Union CRA SBOM requirements for digital products',
    requiredChecks: [
      'component-name',
      'component-version',
      'component-supplier',
      'component-purl',
      'component-hashes',
      'component-license',
      'metadata-author',
      'metadata-timestamp',
      'dependency-coverage',
      'vulnerability-refs'
    ]
  }
};

function getProfile(name) {
  return PROFILES[name.toLowerCase()] || null;
}

function listProfiles() {
  return Object.entries(PROFILES).map(([id, p]) => ({
    id,
    name: p.name,
    description: p.description,
    checkCount: p.requiredChecks.length
  }));
}

function evaluateCompliance(results, profileName) {
  const profile = getProfile(profileName);
  if (!profile) return { error: `Unknown profile: ${profileName}` };

  const passed = [];
  const failed = [];

  for (const checkId of profile.requiredChecks) {
    const result = results.find(r => r.id === checkId);
    if (!result) {
      failed.push({ id: checkId, reason: 'check not found' });
      continue;
    }
    const hasErrors = result.findings.some(f => f.severity === 'error');
    if (hasErrors) {
      failed.push({ id: checkId, reason: 'has errors' });
    } else {
      passed.push(checkId);
    }
  }

  return {
    profile: profile.name,
    compliant: failed.length === 0,
    passed,
    failed,
    score: Math.round((passed.length / profile.requiredChecks.length) * 100)
  };
}

module.exports = { PROFILES, getProfile, listProfiles, evaluateCompliance };
