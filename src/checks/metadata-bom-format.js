const KNOWN_FORMATS = {
  'CycloneDX': ['1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6'],
  'SPDX': ['SPDX-2.2', 'SPDX-2.3']
};

module.exports = {
  id: 'metadata-bom-format',
  name: 'Metadata BOM Format',
  description: 'SBOM should use a recognized format and version',
  weight: 0.2,
  run(sbom) {
    const findings = [];

    if (sbom.bomFormat === 'CycloneDX') {
      if (!sbom.specVersion) {
        findings.push({ severity: 'warning', message: 'CycloneDX SBOM missing specVersion' });
      } else if (!KNOWN_FORMATS.CycloneDX.includes(sbom.specVersion)) {
        findings.push({ severity: 'info', message: `Uncommon CycloneDX version: ${sbom.specVersion}` });
      }
    } else if (sbom.spdxVersion) {
      if (!KNOWN_FORMATS.SPDX.includes(sbom.spdxVersion)) {
        findings.push({ severity: 'info', message: `Uncommon SPDX version: ${sbom.spdxVersion}` });
      }
    } else if (!sbom.bomFormat && !sbom.spdxVersion) {
      findings.push({ severity: 'warning', message: 'Unable to determine SBOM format' });
    }

    return findings;
  }
};
