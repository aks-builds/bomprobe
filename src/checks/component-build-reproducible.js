module.exports = {
  id: 'component-build-reproducible',
  name: 'Component Build Reproducibility',
  description: 'Components with build info should have both source and build hash for reproducibility',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      const refs = c.externalReferences || [];
      const hasSource = refs.some(r => r.type === 'vcs' || r.type === 'source-distribution');
      const hasHash = (c.hashes || []).length > 0;
      const hasBuildMeta = refs.some(r => r.type === 'build-system' || r.type === 'build-meta');

      if (hasBuildMeta && !hasSource) {
        findings.push({
          severity: 'info',
          component: c.name,
          message: `${c.name || 'Unnamed'} has build metadata but no source reference`
        });
      }

      if (hasBuildMeta && !hasHash) {
        findings.push({
          severity: 'info',
          component: c.name,
          message: `${c.name || 'Unnamed'} has build metadata but no hash for verification`
        });
      }
    }
    return findings;
  }
};
