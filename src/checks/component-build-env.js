module.exports = {
  id: 'component-build-env',
  name: 'Component Build Environment',
  description: 'Components should declare build environment properties for reproducibility',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const buildProps = ['build-system', 'build-tool', 'compiler', 'platform', 'os', 'arch'];

    for (const c of sbom.components) {
      if (c.type === 'data' || c.type === 'file') continue;
      const props = c.properties || [];
      const hasBuildInfo = props.some(p =>
        buildProps.some(bp => (p.name || '').toLowerCase().includes(bp))
      );
      const hasEvidence = c.evidence?.occurrences?.length > 0;

      if (!hasBuildInfo && !hasEvidence) {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} has no build environment metadata`
        });
      }
    }
    return findings;
  }
};
