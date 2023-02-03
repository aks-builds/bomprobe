const KNOWN_CDX = ['1.0', '1.1', '1.2', '1.3', '1.4', '1.5'];
const KNOWN_SPDX = ['SPDX-2.2', 'SPDX-2.3'];

module.exports = {
  id: 'spec-version',
  name: 'Spec Version',
  description: 'The SBOM should use a known specification version',
  weight: 0.3,
  run(sbom) {
    const findings = [];
    const ver = sbom.metadata.specVersion;

    if (!ver) {
      findings.push({
        severity: 'warning',
        component: 'metadata',
        message: 'SBOM has no specification version'
      });
      return findings;
    }

    const known = sbom.format === 'cyclonedx' ? KNOWN_CDX : KNOWN_SPDX;
    if (!known.includes(ver)) {
      findings.push({
        severity: 'info',
        component: 'metadata',
        message: `Unknown spec version: ${ver}`
      });
    }

    return findings;
  }
};
