module.exports = {
  id: 'metadata-serial-number',
  name: 'Metadata Serial Number',
  description: 'The SBOM should have a unique serial number or document namespace',
  weight: 0.3,
  run(sbom) {
    const findings = [];
    const hasSerial = sbom.metadata.serialNumber || sbom.metadata.documentNamespace;
    if (!hasSerial) {
      findings.push({
        severity: 'warning',
        component: 'metadata',
        message: 'SBOM has no serial number or document namespace for unique identification'
      });
    }
    return findings;
  }
};
