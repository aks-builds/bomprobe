const KNOWN_TYPES = new Set([
  'application', 'framework', 'library', 'container',
  'platform', 'device-driver', 'firmware', 'file',
  'operating-system', 'device', 'data', 'machine-learning-model',
  'cryptographic-asset'
]);

module.exports = {
  id: 'component-classifier',
  name: 'Component Type Classification',
  description: 'Components should use recognized CycloneDX type values',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (!c.type) {
        findings.push({
          severity: 'info',
          component: c.name,
          message: `${c.name || 'Unnamed'} has no type classification`
        });
      } else if (!KNOWN_TYPES.has(c.type)) {
        findings.push({
          severity: 'warning',
          component: c.name,
          message: `${c.name || 'Unnamed'} uses unrecognized type "${c.type}"`
        });
      }
    }
    return findings;
  }
};
