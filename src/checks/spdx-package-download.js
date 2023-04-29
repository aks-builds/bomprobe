module.exports = {
  id: 'spdx-package-download',
  name: 'SPDX Package Download Location',
  description: 'SPDX packages should have a downloadLocation that is not NOASSERTION',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    if (!sbom.spdxVersion) return findings;

    for (const pkg of (sbom.packages || [])) {
      const dl = pkg.downloadLocation || '';
      if (!dl || dl === 'NOASSERTION' || dl === 'NONE') {
        findings.push({
          severity: 'info',
          component: pkg.name,
          message: `${pkg.name || 'Unknown'} has no useful downloadLocation (${dl || 'empty'})`
        });
      }
    }

    return findings;
  }
};
