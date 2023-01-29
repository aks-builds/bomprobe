module.exports = {
  id: 'component-description',
  name: 'Component Description',
  description: 'Components should have a description',
  weight: 0.3,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (!c.description) {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed component'} has no description`
        });
      }
    }
    return findings;
  }
};
