module.exports = {
  id: 'dependency-transitive-depth',
  name: 'Dependency Transitive Depth',
  description: 'Warns when dependency trees are excessively deep (10+ levels)',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    if (!sbom.dependencies || !Array.isArray(sbom.dependencies)) return findings;

    const depMap = new Map();
    for (const dep of sbom.dependencies) {
      depMap.set(dep.ref, dep.dependsOn || []);
    }

    function getDepth(ref, visited = new Set()) {
      if (visited.has(ref)) return 0;
      visited.add(ref);
      const children = depMap.get(ref) || [];
      if (children.length === 0) return 0;
      let maxChild = 0;
      for (const child of children) {
        const d = getDepth(child, visited);
        if (d > maxChild) maxChild = d;
      }
      return maxChild + 1;
    }

    for (const dep of sbom.dependencies) {
      const depth = getDepth(dep.ref);
      if (depth >= 10) {
        findings.push({
          severity: 'info',
          component: dep.ref,
          message: `${dep.ref} has a dependency depth of ${depth} levels`
        });
      }
    }

    return findings;
  }
};
