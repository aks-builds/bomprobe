module.exports = {
  id: 'metadata-author',
  name: 'SBOM Author',
  description: 'The SBOM should identify who created it',
  weight: 0.7,
  run(sbom) {
    const findings = [];
    if (!sbom.metadata.author) {
      findings.push({
        severity: 'warning',
        component: 'metadata',
        message: 'SBOM has no author identified'
      });
    }
    return findings;
  }
};
