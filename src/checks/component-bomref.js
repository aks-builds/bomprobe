module.exports = {
  id: 'component-bomref',
  name: 'Component BOM Reference',
  description: 'Components should have a bom-ref for dependency tracking',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (!c['bom-ref']) {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} has no bom-ref identifier`
        });
      }
    }
    return findings;
  }
};
