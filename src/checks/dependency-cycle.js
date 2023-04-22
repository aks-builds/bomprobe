const { buildAdjacencyList, detectCycles } = require('../utils/dependencyGraph');

module.exports = {
  id: 'dependency-cycle',
  name: 'Dependency Cycle Detection',
  description: 'Dependency graph should not contain circular references',
  weight: 0.3,
  run(sbom) {
    const findings = [];
    const deps = sbom.dependencies || [];
    if (deps.length === 0) return findings;

    const graph = buildAdjacencyList(deps);
    const cycles = detectCycles(graph);

    for (const cycle of cycles) {
      findings.push({
        severity: 'warning',
        message: `Circular dependency detected: ${cycle.join(' -> ')}`
      });
    }

    return findings;
  }
};
