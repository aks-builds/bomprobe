module.exports = {
  id: 'metadata-component',
  name: 'Metadata Component',
  description: 'The SBOM should identify the subject component in metadata',
  weight: 0.5,
  run(sbom) {
    const findings = [];
    if (!sbom.metadata.subjectName) {
      findings.push({
        severity: 'warning',
        component: 'metadata',
        message: 'SBOM does not identify the subject component in metadata'
      });
    }
    return findings;
  }
};
