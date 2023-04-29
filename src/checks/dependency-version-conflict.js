module.exports = {
  id: 'dependency-version-conflict',
  name: 'Dependency Version Conflict',
  description: 'Components with the same name should not have conflicting versions in the SBOM',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    const nameVersions = new Map();

    for (const c of (sbom.components || [])) {
      if (!c.name || !c.version) continue;
      const existing = nameVersions.get(c.name);
      if (existing && existing !== c.version) {
        findings.push({
          severity: 'warning',
          component: c.name,
          message: `${c.name} has conflicting versions: ${existing} vs ${c.version}`
        });
      } else {
        nameVersions.set(c.name, c.version);
      }
    }

    return findings;
  }
};
