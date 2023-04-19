const { parsePolicy } = require('./parser');

function evaluatePolicy(result, policyRules) {
  const rules = Array.isArray(policyRules[0]?.test) ? policyRules : parsePolicy(policyRules);
  const violations = [];
  const passed = [];

  const score = typeof result.score === 'object' ? result.score.overall : result.score;
  const context = {
    score,
    grade: result.grade || '',
    componentCount: result.results?.length || 0,
    errorCount: countBySeverity(result, 'error'),
    warningCount: countBySeverity(result, 'warning'),
    infoCount: countBySeverity(result, 'info')
  };

  for (const rule of rules) {
    const actual = context[rule.field];
    if (actual === undefined) continue;

    if (rule.test(actual)) {
      passed.push({ rule, actual });
    } else {
      violations.push({ rule, actual, message: rule.message, severity: rule.severity });
    }
  }

  return {
    pass: violations.length === 0,
    violations,
    passed,
    summary: violations.length === 0
      ? 'All policy rules satisfied'
      : `${violations.length} policy violation(s) found`
  };
}

function countBySeverity(result, severity) {
  let count = 0;
  for (const r of (result.results || [])) {
    for (const f of r.findings) {
      if (f.severity === severity) count++;
    }
  }
  return count;
}

module.exports = { evaluatePolicy };
