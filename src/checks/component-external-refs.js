module.exports = {
  id: 'component-external-refs',
  name: 'Component External References',
  description: 'Components should have at least one external reference (purl, cpe, or other)',
  weight: 0.3,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      const hasRef = c.purl || c.cpe;
      if (!hasRef) {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed component'} has no external references`
        });
      }
    }
    return findings;
  }
};
