module.exports = {
  id: 'component-copyright',
  name: 'Component Copyright',
  description: 'Components should include copyright information',
  weight: 0.3,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (!c.copyright) {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed component'} has no copyright information`
        });
      }
    }
    return findings;
  }
};
