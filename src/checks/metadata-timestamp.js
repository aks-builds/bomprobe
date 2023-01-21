module.exports = {
  id: 'metadata-timestamp',
  name: 'SBOM Timestamp',
  description: 'The SBOM should have a creation timestamp',
  weight: 0.7,
  run(sbom) {
    const findings = [];
    if (!sbom.metadata.timestamp) {
      findings.push({
        severity: 'warning',
        component: 'metadata',
        message: 'SBOM has no creation timestamp'
      });
    }
    return findings;
  }
};
