module.exports = {
  id: 'metadata-license',
  name: 'Metadata License',
  description: 'The SBOM document should declare its own license',
  weight: 0.3,
  run(sbom) {
    const findings = [];
    if (!sbom.metadata.documentLicense) {
      findings.push({
        severity: 'info',
        component: 'metadata',
        message: 'SBOM document has no declared license'
      });
    }
    return findings;
  }
};
