module.exports = {
  id: 'component-maturity',
  name: 'Component Maturity Indicators',
  description: 'Components should have maturity signals like release notes, CPE, or SWID',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (c.type === 'data' || c.type === 'file') continue;

      let signals = 0;
      if (c.releaseNotes) signals++;
      if (c.cpe) signals++;
      if (c.swid) signals++;
      if (c.pedigree) signals++;
      if (c.evidence) signals++;
      if (c.description) signals++;

      if (signals === 0) {
        findings.push({
          severity: 'info',
          component: c.name,
          message: `${c.name || 'Unnamed'} has no maturity indicators (description, cpe, swid, pedigree, evidence, release notes)`
        });
      }
    }
    return findings;
  }
};
