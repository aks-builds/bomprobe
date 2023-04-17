module.exports = {
  id: 'metadata-lifecyclephase',
  name: 'Metadata Lifecycle Phase',
  description: 'SBOM should declare its lifecycle phase (pre-build, build, post-build, etc)',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const meta = sbom.metadata || {};
    const validPhases = ['pre-build', 'build', 'post-build', 'operations', 'discovery', 'decommission'];

    const hasLifecycle = meta.lifecycles?.length > 0;
    const hasProp = meta.properties?.some(p =>
      (p.name || '').toLowerCase().includes('lifecycle') ||
      (p.name || '').toLowerCase().includes('phase')
    );

    if (!hasLifecycle && !hasProp) {
      findings.push({
        severity: 'info',
        message: 'SBOM metadata does not declare a lifecycle phase'
      });
    }

    if (meta.lifecycles) {
      for (const lc of meta.lifecycles) {
        const phase = (lc.phase || lc.name || '').toLowerCase();
        if (phase && !validPhases.includes(phase)) {
          findings.push({
            severity: 'info',
            message: `Non-standard lifecycle phase: ${phase}`
          });
        }
      }
    }

    return findings;
  }
};
