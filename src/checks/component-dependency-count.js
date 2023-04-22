module.exports = {
  id: 'component-dependency-count',
  name: 'Component Dependency Count',
  description: 'Components with excessive direct dependencies may indicate poor modularity',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const deps = sbom.dependencies || [];
    const threshold = 20;

    for (const dep of deps) {
      const children = dep.dependsOn || [];
      if (children.length > threshold) {
        findings.push({
          severity: 'info',
          message: `${dep.ref} has ${children.length} direct dependencies (threshold: ${threshold})`
        });
      }
    }

    return findings;
  }
};
