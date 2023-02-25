function countBySeverity(checkResults) {
  const counts = { error: 0, warning: 0, info: 0 };
  for (const check of checkResults) {
    for (const f of check.findings) {
      if (counts[f.severity] !== undefined) {
        counts[f.severity]++;
      }
    }
  }
  return counts;
}

function totalFindings(checkResults) {
  return checkResults.reduce((sum, c) => sum + c.findings.length, 0);
}

module.exports = { countBySeverity, totalFindings };
