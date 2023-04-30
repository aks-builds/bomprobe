module.exports = {
  id: 'metadata-doc-format',
  name: 'Document Format Declared',
  description: 'SBOM should declare its format and spec version at the top level',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    if (!sbom.bomFormat && !sbom.spdxVersion) {
      findings.push({
        severity: 'error',
        message: 'SBOM does not declare bomFormat (CycloneDX) or spdxVersion (SPDX)'
      });
    }
    if (!sbom.specVersion && !sbom.spdxVersion) {
      findings.push({
        severity: 'warning',
        message: 'SBOM does not declare specVersion'
      });
    }
    return findings;
  }
};
