const SEMVER_RE = /^\d+\.\d+\.\d+/;

module.exports = {
  id: 'version-consistency',
  name: 'Version Consistency',
  description: 'Component versions should follow a consistent format (semver preferred)',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    let semverCount = 0;
    let otherCount = 0;

    for (const c of sbom.components) {
      if (!c.version) continue;
      if (SEMVER_RE.test(c.version)) {
        semverCount++;
      } else {
        otherCount++;
      }
    }

    if (semverCount > 0 && otherCount > 0) {
      for (const c of sbom.components) {
        if (c.version && !SEMVER_RE.test(c.version)) {
          findings.push({
            severity: 'info',
            component: c.name || 'unnamed',
            message: `${c.name || 'Unnamed'} version "${c.version}" is not semver while most others are`
          });
        }
      }
    }

    return findings;
  }
};
