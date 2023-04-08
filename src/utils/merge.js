function mergeResults(results) {
  if (!results || results.length === 0) return null;
  if (results.length === 1) return results[0];

  const merged = {
    files: results.map(r => r.file),
    format: results.map(r => r.format).join(', '),
    componentCount: results.reduce((sum, r) => sum + r.componentCount, 0),
    score: {
      overall: average(results.map(r => r.score.overall)),
      components: { average: average(results.map(r => r.score.components.average)) },
      metadata: average(results.map(r => r.score.metadata)),
      dependencyCoverage: average(results.map(r => r.score.dependencyCoverage))
    },
    checks: mergeChecks(results)
  };

  return merged;
}

function mergeChecks(results) {
  const checkMap = new Map();
  for (const r of results) {
    for (const c of r.checks) {
      if (!checkMap.has(c.id)) {
        checkMap.set(c.id, { ...c, findings: [...c.findings] });
      } else {
        checkMap.get(c.id).findings.push(...c.findings);
      }
    }
  }
  return [...checkMap.values()];
}

function average(nums) {
  if (nums.length === 0) return 0;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

module.exports = { mergeResults };
