module.exports = {
  id: 'dependency-completeness',
  name: 'Dependency Completeness',
  description: 'All dependency references should point to known components',
  weight: 0.3,
  run(sbom) {
    const findings = [];
    const knownRefs = new Set();

    for (const c of sbom.components) {
      if (c['bom-ref']) knownRefs.add(c['bom-ref']);
    }

    const deps = sbom.dependencies || [];
    for (const d of deps) {
      const dependsOn = d.dependsOn || [];
      for (const ref of dependsOn) {
        if (!knownRefs.has(ref)) {
          findings.push({
            severity: 'warning',
            message: `Dependency ref '${ref}' not found in component list`
          });
        }
      }
    }

    return findings;
  }
};
