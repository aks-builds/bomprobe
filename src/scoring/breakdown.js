function categorizeFindings(results) {
  const categories = {
    metadata: [],
    components: [],
    dependencies: [],
    compliance: []
  };

  for (const r of results) {
    const id = r.id;
    if (id.startsWith('metadata-') || id === 'spec-version' || id === 'bom-freshness') {
      categories.metadata.push(r);
    } else if (id.startsWith('dependency-') || id === 'composition-completeness') {
      categories.dependencies.push(r);
    } else if (id.startsWith('license-') || id === 'vulnerability-refs') {
      categories.compliance.push(r);
    } else {
      categories.components.push(r);
    }
  }

  return categories;
}

function categoryScore(checkResults) {
  if (checkResults.length === 0) return 100;
  let totalWeight = 0;
  let weightedPenalty = 0;

  for (const r of checkResults) {
    const errorCount = r.findings.filter(f => f.severity === 'error').length;
    const warnCount = r.findings.filter(f => f.severity === 'warning').length;
    totalWeight += r.weight;
    const penalty = Math.min(1, errorCount * 0.3 + warnCount * 0.1);
    weightedPenalty += penalty * r.weight;
  }

  if (totalWeight === 0) return 100;
  return Math.round((1 - weightedPenalty / totalWeight) * 100);
}

function scoreBreakdown(results) {
  const categories = categorizeFindings(results);
  return {
    metadata: categoryScore(categories.metadata),
    components: categoryScore(categories.components),
    dependencies: categoryScore(categories.dependencies),
    compliance: categoryScore(categories.compliance)
  };
}

module.exports = { categorizeFindings, categoryScore, scoreBreakdown };
