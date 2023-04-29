module.exports = {
  id: 'spdx-package-supplier',
  name: 'SPDX Package Supplier',
  description: 'SPDX packages should have a supplier that is not NOASSERTION',
  weight: 0.1,
  run(sbom) {
    const findings = [];

    for (const pkg of (sbom.packages || [])) {
      if (!pkg.supplier || pkg.supplier === 'NOASSERTION') {
        findings.push({
          severity: 'info',
          component: pkg.name,
          message: `${pkg.name || 'unnamed'} has no supplier information`
        });
      }
    }

    return findings;
  }
};
