function generateAnnotations(result) {
  const annotations = [];
  for (const check of (result.checks || [])) {
    for (const finding of check.findings) {
      if (finding.severity === 'error' || finding.severity === 'warning') {
        annotations.push({
          level: finding.severity === 'error' ? 'error' : 'warning',
          message: `[${check.id}] ${finding.message}`,
          title: check.name
        });
      }
    }
  }
  return annotations;
}

function toGithubOutput(result, gateResult) {
  const lines = [];
  const score = typeof result.score === 'object' ? result.score.overall : result.score;
  lines.push(`score=${score}`);
  lines.push(`grade=${result.grade || ''}`);
  lines.push(`passed=${gateResult ? gateResult.passed : true}`);
  lines.push(`findings=${countFindings(result)}`);
  lines.push(`checks=${(result.checks || []).length}`);
  return lines.join('\n');
}

function countFindings(result) {
  return (result.checks || []).reduce((n, c) => n + c.findings.length, 0);
}

module.exports = { generateAnnotations, toGithubOutput };
