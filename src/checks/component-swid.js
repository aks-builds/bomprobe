module.exports = {
  id: 'component-swid',
  name: 'Component SWID',
  description: 'Components should include SWID tags for software identification',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (!c.swid && !c.purl && !c.cpe) {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} has no SWID, PURL, or CPE identifier`
        });
      }
    }
    return findings;
  }
};
