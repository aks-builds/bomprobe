module.exports = {
  id: 'component-reproducible',
  name: 'Component Reproducibility',
  description: 'Components should have enough info for reproducible builds (hash + purl + version)',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (c.type === 'data' || c.type === 'file') continue;

      const hasHash = c.hashes?.length > 0;
      const hasPurl = !!c.purl;
      const hasVersion = !!c.version;

      if (!hasHash && !hasPurl) {
        findings.push({
          severity: 'info',
          component: c.name,
          message: `${c.name || 'Unnamed'} has neither hash nor purl for reproducibility`
        });
      } else if (!hasVersion && hasPurl) {
        findings.push({
          severity: 'info',
          component: c.name,
          message: `${c.name || 'Unnamed'} has purl but no version for pinned reproducibility`
        });
      }
    }
    return findings;
  }
};
