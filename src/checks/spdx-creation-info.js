module.exports = {
  id: 'spdx-creation-info',
  name: 'SPDX Creation Information',
  description: 'SPDX documents should have creation info with creator, date, and license list version',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const ci = sbom.creationInfo;

    if (!ci) {
      if (sbom.spdxVersion) {
        findings.push({ severity: 'warning', message: 'SPDX document missing creationInfo section' });
      }
      return findings;
    }

    if (!ci.creators?.length) {
      findings.push({ severity: 'warning', message: 'creationInfo missing creators' });
    }

    if (!ci.created) {
      findings.push({ severity: 'warning', message: 'creationInfo missing creation date' });
    }

    if (!ci.licenseListVersion) {
      findings.push({ severity: 'info', message: 'creationInfo missing licenseListVersion' });
    }

    return findings;
  }
};
