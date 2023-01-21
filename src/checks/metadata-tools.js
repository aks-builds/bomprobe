module.exports = {
  id: 'metadata-tools',
  name: 'SBOM Tools',
  description: 'The SBOM should list which tools generated it',
  weight: 0.5,
  run(sbom) {
    const findings = [];
    if (sbom.metadata.toolCount === 0) {
      findings.push({
        severity: 'info',
        component: 'metadata',
        message: 'SBOM does not list any generating tools'
      });
    }
    return findings;
  }
};
