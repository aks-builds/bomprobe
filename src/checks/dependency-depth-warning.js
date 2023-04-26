module.exports = {
  id: 'dependency-depth-warning',
  name: 'Deep Dependency Chain Warning',
  description: 'Flags dependency chains deeper than a threshold',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const graph = new Map();

    for (const dep of (sbom.dependencies || [])) {
      graph.set(dep.ref, dep.dependsOn || []);
    }

    const depthCache = new Map();
    const maxDepth = 10;

    function getDepth(ref, visited) {
      if (depthCache.has(ref)) return depthCache.get(ref);
      if (visited.has(ref)) return 0;

      visited.add(ref);
      const children = graph.get(ref) || [];
      let max = 0;
      for (const child of children) {
        max = Math.max(max, 1 + getDepth(child, visited));
      }
      visited.delete(ref);
      depthCache.set(ref, max);
      return max;
    }

    for (const ref of graph.keys()) {
      const depth = getDepth(ref, new Set());
      if (depth > maxDepth) {
        findings.push({
          severity: 'info',
          message: `Dependency chain from "${ref}" is ${depth} levels deep (threshold: ${maxDepth})`
        });
      }
    }

    return findings;
  }
};
