module.exports = {
  id: 'dependency-license-tree',
  name: 'Dependency License Tree Coverage',
  description: 'All dependency tree nodes should have license info on the component',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    const licenseMap = new Map();

    for (const c of sbom.components) {
      const ref = c.purl || c['bom-ref'] || c.name;
      const hasLicense = c.licenses?.length > 0;
      licenseMap.set(ref, hasLicense);
    }

    for (const dep of (sbom.dependencies || [])) {
      for (const child of (dep.dependsOn || [])) {
        if (licenseMap.has(child) && !licenseMap.get(child)) {
          findings.push({
            severity: 'warning',
            component: child,
            message: `Dependency "${child}" in tree lacks license information`
          });
        }
      }
    }

    return findings;
  }
};
