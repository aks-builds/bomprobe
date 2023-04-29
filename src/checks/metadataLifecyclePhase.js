const VALID_PHASES = [
  'design', 'pre-build', 'build', 'post-build',
  'operations', 'discovery', 'decommission'
];

module.exports = {
  id: 'metadata-lifecycle-phase',
  name: 'Metadata Lifecycle Phase',
  description: 'SBOM should declare which lifecycle phase it was generated in',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const lifecycle = sbom.metadata?.lifecycles || sbom.metadata?.lifecycle;

    if (!lifecycle) {
      findings.push({
        severity: 'info',
        message: 'SBOM does not declare a lifecycle phase'
      });
      return findings;
    }

    const phases = Array.isArray(lifecycle) ? lifecycle : [lifecycle];
    for (const phase of phases) {
      const name = typeof phase === 'string' ? phase : phase.phase;
      if (name && !VALID_PHASES.includes(name.toLowerCase())) {
        findings.push({
          severity: 'warning',
          message: `Unknown lifecycle phase: ${name}. Valid phases: ${VALID_PHASES.join(', ')}`
        });
      }
    }

    return findings;
  }
};
