const UUID_PATTERN = /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

module.exports = {
  id: 'metadata-serial-format',
  name: 'Metadata Serial Number Format',
  description: 'CycloneDX serial number should follow URN UUID format',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const serial = sbom.serialNumber;

    if (!serial) return findings;

    if (!UUID_PATTERN.test(serial)) {
      findings.push({
        severity: 'warning',
        message: `Serial number "${serial}" does not match urn:uuid format`
      });
    }

    return findings;
  }
};
