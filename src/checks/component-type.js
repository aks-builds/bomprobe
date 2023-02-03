const VALID_TYPES = [
  'application', 'framework', 'library', 'container',
  'device', 'firmware', 'file', 'operating-system', 'data'
];

module.exports = {
  id: 'component-type',
  name: 'Component Type',
  description: 'Components should specify their type',
  weight: 0.4,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (!c.type) {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed component'} has no type specified`
        });
      }
    }
    return findings;
  }
};
