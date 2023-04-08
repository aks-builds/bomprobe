const { isPrerelease, isMajorZero } = require('../utils/versionAnalysis');

module.exports = {
  id: 'component-prerelease',
  name: 'Component Prerelease',
  description: 'Components should use stable releases in production SBOMs',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (!c.version) continue;
      if (isPrerelease(c.version)) {
        findings.push({
          severity: 'warning',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} uses prerelease version ${c.version}`
        });
      }
      if (isMajorZero(c.version)) {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} is at major version 0 (${c.version}), which signals unstable API`
        });
      }
    }
    return findings;
  }
};
