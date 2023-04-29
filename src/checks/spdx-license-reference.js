module.exports = {
  id: 'spdx-license-reference',
  name: 'SPDX License Reference',
  description: 'Non-standard SPDX licenses (LicenseRef-) should follow naming conventions',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const pattern = /^LicenseRef-[a-zA-Z0-9._-]+$/;

    const packages = sbom.packages || [];
    for (const pkg of packages) {
      const lic = pkg.licenseConcluded || pkg.licenseDeclared || '';
      if (lic.startsWith('LicenseRef-') && !pattern.test(lic)) {
        findings.push({
          severity: 'warning',
          component: pkg.name,
          message: `${pkg.name || 'unnamed'} has malformed LicenseRef: ${lic}`
        });
      }
    }

    for (const c of (sbom.components || [])) {
      const licId = c.licenses?.[0]?.license?.id || c.licenses?.[0]?.id || '';
      if (licId.startsWith('LicenseRef-') && !pattern.test(licId)) {
        findings.push({
          severity: 'warning',
          component: c.name,
          message: `${c.name || 'unnamed'} has malformed LicenseRef: ${licId}`
        });
      }
    }

    return findings;
  }
};
