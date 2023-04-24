module.exports = {
  id: 'spdx-data-license',
  name: 'SPDX Data License',
  description: 'SPDX documents should declare CC0-1.0 as the data license',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    if (!sbom.dataLicense && sbom.spdxVersion) {
      findings.push({
        severity: 'warning',
        message: 'SPDX document missing dataLicense field (should be CC0-1.0)'
      });
    } else if (sbom.dataLicense && sbom.dataLicense !== 'CC0-1.0') {
      findings.push({
        severity: 'warning',
        message: `SPDX dataLicense is "${sbom.dataLicense}", expected "CC0-1.0"`
      });
    }
    return findings;
  }
};
