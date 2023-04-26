module.exports = {
  id: 'spdx-extracted-license',
  name: 'SPDX Extracted License Info',
  description: 'Non-standard licenses referenced in SPDX should have extractedLicensingInfos entries',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    if (!sbom.spdxVersion) return findings;

    const extracted = new Set();
    for (const e of (sbom.hasExtractedLicensingInfos || [])) {
      if (e.licenseId) extracted.add(e.licenseId);
    }

    for (const pkg of (sbom.packages || [])) {
      const lic = pkg.licenseConcluded || pkg.licenseDeclared || '';
      if (lic.startsWith('LicenseRef-') && !extracted.has(lic)) {
        findings.push({
          severity: 'warning',
          component: pkg.name,
          message: `${pkg.name || 'Unknown'} references ${lic} but no extractedLicensingInfos entry exists`
        });
      }
    }

    return findings;
  }
};
