module.exports = {
  id: 'spdx-package-originator',
  name: 'SPDX Package Originator',
  description: 'SPDX packages should have an originator that is not NOASSERTION',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    if (!sbom.spdxVersion) return findings;

    for (const pkg of (sbom.packages || [])) {
      const orig = pkg.originator || '';
      if (!orig || orig === 'NOASSERTION') {
        findings.push({
          severity: 'info',
          component: pkg.name,
          message: `${pkg.name || 'Unknown'} has no useful originator (${orig || 'empty'})`
        });
      }
    }

    return findings;
  }
};
