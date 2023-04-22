module.exports = {
  id: 'spdx-snippet-info',
  name: 'SPDX Snippet Information',
  description: 'SPDX snippets should have byte range, license, and copyright',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const snippets = sbom.snippets || [];

    for (const s of snippets) {
      const name = s.name || s.SPDXID || 'unknown';
      if (!s.snippetFromFile) {
        findings.push({
          severity: 'warning',
          message: `Snippet "${name}" missing snippetFromFile reference`
        });
      }
      if (!s.ranges?.length) {
        findings.push({
          severity: 'warning',
          message: `Snippet "${name}" missing byte/line range`
        });
      }
      if (!s.licenseConcluded && !s.licenseInfoInSnippets?.length) {
        findings.push({
          severity: 'info',
          message: `Snippet "${name}" missing license information`
        });
      }
    }

    return findings;
  }
};
