module.exports = {
  id: 'metadata-lifecycle',
  name: 'Metadata Lifecycle',
  description: 'The SBOM should have both author and timestamp for lifecycle tracking',
  weight: 0.3,
  run(sbom) {
    const findings = [];
    if (!sbom.metadata.author && !sbom.metadata.timestamp) {
      findings.push({
        severity: 'warning',
        component: 'metadata',
        message: 'SBOM has neither author nor timestamp for lifecycle tracking'
      });
    } else if (!sbom.metadata.author) {
      findings.push({
        severity: 'info',
        component: 'metadata',
        message: 'SBOM has timestamp but no author for full lifecycle tracking'
      });
    } else if (!sbom.metadata.timestamp) {
      findings.push({
        severity: 'info',
        component: 'metadata',
        message: 'SBOM has author but no timestamp for full lifecycle tracking'
      });
    }
    return findings;
  }
};
