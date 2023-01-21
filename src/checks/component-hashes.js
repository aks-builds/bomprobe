module.exports = {
  id: 'component-hashes',
  name: 'Component Hashes',
  description: 'Components should include integrity hashes',
  weight: 0.5,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (c.hashes === 0) {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed component'} has no integrity hashes`
        });
      }
    }
    return findings;
  }
};
