module.exports = {
  id: 'component-name',
  name: 'Component Name',
  description: 'Every component should have a name',
  weight: 1.0,
  run(sbom) {
    const findings = [];
    for (let i = 0; i < sbom.components.length; i++) {
      const c = sbom.components[i];
      if (!c.name) {
        findings.push({
          severity: 'error',
          component: `component[${i}]`,
          message: `Component at index ${i} has no name`
        });
      }
    }
    return findings;
  }
};
