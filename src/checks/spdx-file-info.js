module.exports = {
  id: 'spdx-file-info',
  name: 'SPDX File Information',
  description: 'SPDX files should have checksums and license info',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const files = sbom.files || [];

    for (const f of files) {
      const name = f.fileName || f.SPDXID || 'unknown';

      if (!f.checksums?.length) {
        findings.push({
          severity: 'info',
          message: `File "${name}" missing checksum`
        });
      }

      if (!f.licenseConcluded && !f.licenseInfoInFiles?.length) {
        findings.push({
          severity: 'info',
          message: `File "${name}" missing license information`
        });
      }

      if (!f.copyrightText && f.copyrightText !== 'NOASSERTION') {
        findings.push({
          severity: 'info',
          message: `File "${name}" missing copyright text`
        });
      }
    }

    return findings;
  }
};
