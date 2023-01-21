module.exports = {
  id: 'component-license',
  name: 'Component License',
  description: 'Components should declare a license',
  weight: 0.8,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (!c.license) {
        findings.push({
          severity: 'warning',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed component'} has no license`
        });
      }
    }
    return findings;
  }
};
