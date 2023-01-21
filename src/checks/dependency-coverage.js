module.exports = {
  id: 'dependency-coverage',
  name: 'Dependency Coverage',
  description: 'The dependency graph should cover all components',
  weight: 0.6,
  run(sbom) {
    const findings = [];
    const { dependencyGraph, components } = sbom;

    if (components.length === 0) return findings;

    if (dependencyGraph.totalEntries === 0) {
      findings.push({
        severity: 'warning',
        component: 'dependencies',
        message: 'SBOM has no dependency relationships'
      });
      return findings;
    }

    const pct = Math.round(dependencyGraph.coverage * 100);
    if (pct < 50) {
      findings.push({
        severity: 'warning',
        component: 'dependencies',
        message: `Dependency graph covers only ${pct}% of components`
      });
    }

    return findings;
  }
};
