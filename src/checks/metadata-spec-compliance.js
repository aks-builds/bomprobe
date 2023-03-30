const CDX_CURRENT = ['1.4', '1.5'];
const SPDX_CURRENT = ['SPDX-2.3', 'SPDX-2.2'];

module.exports = {
  id: 'metadata-spec-compliance',
  name: 'Metadata Spec Compliance',
  description: 'The SBOM should use a current specification version',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    const ver = sbom.metadata.specVersion;
    if (!ver) return findings;

    if (sbom.format === 'cyclonedx' && !CDX_CURRENT.includes(ver)) {
      findings.push({
        severity: 'info',
        component: 'metadata',
        message: `CycloneDX spec version ${ver} is outdated, consider upgrading to 1.4 or 1.5`
      });
    }

    if (sbom.format === 'spdx' && !SPDX_CURRENT.includes(ver)) {
      findings.push({
        severity: 'info',
        component: 'metadata',
        message: `SPDX spec version ${ver} is outdated, consider upgrading to 2.3`
      });
    }

    return findings;
  }
};
