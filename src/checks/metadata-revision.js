module.exports = {
  id: 'metadata-revision',
  name: 'Metadata Revision',
  description: 'SBOM metadata should track revision history for change management',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const meta = sbom.metadata || {};
    const component = meta.component || {};

    if (!meta.version && !component.version) {
      findings.push({
        severity: 'info',
        message: 'No SBOM version/revision in metadata - useful for tracking changes over time'
      });
    }

    return findings;
  }
};
