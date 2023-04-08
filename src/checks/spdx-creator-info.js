module.exports = {
  id: 'spdx-creator-info',
  name: 'SPDX Creator Information',
  description: 'SPDX documents should have creator information with tool and organization',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    if (sbom.format !== 'spdx') return findings;

    const creators = sbom.metadata?.creators || [];
    if (creators.length === 0) {
      findings.push({
        severity: 'warning',
        message: 'SPDX document has no creator information'
      });
      return findings;
    }

    const hasTool = creators.some(c => typeof c === 'string' && c.startsWith('Tool:'));
    const hasOrg = creators.some(c => typeof c === 'string' && c.startsWith('Organization:'));

    if (!hasTool) {
      findings.push({
        severity: 'info',
        message: 'No tool creator listed - tool identification helps with reproducibility'
      });
    }
    if (!hasOrg) {
      findings.push({
        severity: 'info',
        message: 'No organization creator listed'
      });
    }

    return findings;
  }
};
