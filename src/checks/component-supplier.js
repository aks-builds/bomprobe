module.exports = {
  id: 'component-supplier',
  name: 'Component Supplier',
  description: 'Components should identify their supplier',
  weight: 0.8,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (!c.supplier) {
        findings.push({
          severity: 'warning',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed component'} has no supplier`
        });
      }
    }
    return findings;
  }
};
