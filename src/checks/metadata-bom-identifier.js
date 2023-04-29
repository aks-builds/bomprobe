module.exports = {
  id: 'metadata-bom-identifier',
  name: 'Metadata BOM Identifier',
  description: 'BOM should have a unique identifier (serialNumber for CycloneDX, documentNamespace for SPDX)',
  weight: 0.2,
  run(sbom) {
    const findings = [];

    const hasSerial = sbom.serialNumber && sbom.serialNumber.startsWith('urn:uuid:');
    const hasNamespace = sbom.documentNamespace;

    if (!hasSerial && !hasNamespace) {
      findings.push({
        severity: 'warning',
        message: 'BOM has no unique identifier (serialNumber or documentNamespace)'
      });
    }

    if (hasSerial && !/^urn:uuid:[0-9a-f-]{36}$/.test(sbom.serialNumber)) {
      findings.push({
        severity: 'info',
        message: `serialNumber format looks non-standard: ${sbom.serialNumber}`
      });
    }

    return findings;
  }
};
