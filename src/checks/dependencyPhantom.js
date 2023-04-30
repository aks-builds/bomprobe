module.exports = {
  id: 'dependency-phantom',
  name: 'Phantom Dependencies',
  description: 'Dependencies referenced in dependency graph should exist in components list',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    const componentRefs = new Set();
    for (const c of (sbom.components || [])) {
      if (c['bom-ref']) componentRefs.add(c['bom-ref']);
      if (c.purl) componentRefs.add(c.purl);
      if (c.name) componentRefs.add(c.name);
    }

    for (const dep of (sbom.dependencies || [])) {
      for (const child of (dep.dependsOn || [])) {
        if (!componentRefs.has(child)) {
          findings.push({
            severity: 'warning',
            message: `Dependency "${child}" referenced in graph but not found in components`
          });
        }
      }
    }
    return findings;
  }
};
