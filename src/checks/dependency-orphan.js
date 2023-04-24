module.exports = {
  id: 'dependency-orphan',
  name: 'Orphan Dependency Detection',
  description: 'Components listed in dependencies should exist in the component list',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    const componentRefs = new Set();

    for (const c of sbom.components) {
      if (c.purl) componentRefs.add(c.purl);
      if (c['bom-ref']) componentRefs.add(c['bom-ref']);
    }

    for (const dep of (sbom.dependencies || [])) {
      if (dep.ref && !componentRefs.has(dep.ref)) {
        findings.push({
          severity: 'warning',
          message: `Dependency ref "${dep.ref}" not found in component list`
        });
      }
      for (const child of (dep.dependsOn || [])) {
        if (!componentRefs.has(child)) {
          findings.push({
            severity: 'warning',
            message: `Dependency target "${child}" not found in component list`
          });
        }
      }
    }

    return findings;
  }
};
