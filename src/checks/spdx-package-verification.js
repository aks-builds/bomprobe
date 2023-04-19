module.exports = {
  id: 'spdx-package-verification',
  name: 'SPDX Package Verification Code',
  description: 'SPDX packages should include package verification code for integrity',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    if (sbom.format !== 'spdx' && !sbom.spdxVersion) return findings;

    const packages = sbom.packages || sbom.components || [];
    for (const pkg of packages) {
      const hasVerification = pkg.packageVerificationCode ||
        pkg.checksums?.length > 0 ||
        pkg.hashes?.length > 0;

      if (!hasVerification) {
        findings.push({
          severity: 'info',
          component: pkg.name || pkg.SPDXID || 'unnamed',
          message: `${pkg.name || 'Unnamed'} has no verification code or checksums`
        });
      }
    }
    return findings;
  }
};
