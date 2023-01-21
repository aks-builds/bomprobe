module.exports = {
  id: 'component-version',
  name: 'Component Version',
  description: 'Every component should have a version',
  weight: 1.0,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (!c.version) {
        findings.push({
          severity: 'warning',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed component'} has no version`
        });
      }
    }
    return findings;
  }
};
