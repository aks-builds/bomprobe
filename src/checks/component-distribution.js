module.exports = {
  id: 'component-distribution',
  name: 'Component Distribution URL',
  description: 'Components should have a distribution external reference for reproducible builds',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (c.type === 'data' || c.type === 'file') continue;

      const refs = c.externalReferences || [];
      const hasDist = refs.some(r => r.type === 'distribution' || r.type === 'distribution-intake');

      if (!hasDist && !c.purl) {
        findings.push({
          severity: 'info',
          component: c.name,
          message: `${c.name || 'Unnamed'} has no distribution URL and no purl for fetching`
        });
      }
    }
    return findings;
  }
};
