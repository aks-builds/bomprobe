module.exports = {
  id: 'component-cpe',
  name: 'Component CPE',
  description: 'Components should have a CPE identifier for vulnerability matching',
  weight: 0.4,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (!c.cpe) {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed component'} has no CPE identifier`
        });
      }
    }
    return findings;
  }
};
