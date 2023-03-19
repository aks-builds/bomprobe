module.exports = {
  id: 'component-dependencies',
  name: 'Component Dependencies',
  description: 'Components should appear in the dependency graph',
  weight: 0.4,
  run(sbom) {
    const findings = [];
    if (sbom.dependencyGraph.totalEntries === 0 && sbom.components.length > 0) {
      findings.push({
        severity: 'warning',
        component: 'dependency-graph',
        message: 'SBOM has components but an empty dependency graph'
      });
      return findings;
    }
    const coverage = sbom.dependencyGraph.coverage;
    if (sbom.components.length > 0 && coverage < 0.5) {
      findings.push({
        severity: 'info',
        component: 'dependency-graph',
        message: `Only ${Math.round(coverage * 100)}% of components appear in the dependency graph`
      });
    }
    return findings;
  }
};
