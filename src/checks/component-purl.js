module.exports = {
  id: 'component-purl',
  name: 'Component PURL',
  description: 'Components should have a package URL for identification',
  weight: 0.9,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (!c.purl) {
        findings.push({
          severity: 'warning',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed component'} has no purl`
        });
      }
    }
    return findings;
  }
};
