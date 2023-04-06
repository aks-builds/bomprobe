const { buildGraph, getDepth } = require('../utils/depGraph');

const MAX_DEPTH = 10;

module.exports = {
  id: 'dependency-depth',
  name: 'Dependency Depth',
  description: 'Deep dependency trees increase supply chain risk',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    if (!sbom.dependencies || sbom.dependencies.length === 0) return findings;

    const graph = buildGraph(sbom);
    const depth = getDepth(graph);

    if (depth > MAX_DEPTH) {
      findings.push({
        severity: 'warning',
        message: `Dependency tree depth is ${depth}, exceeding recommended maximum of ${MAX_DEPTH}`
      });
    }

    return findings;
  }
};
