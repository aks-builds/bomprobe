function evaluatePolicy(result, policy) {
  const violations = [];

  if (policy.minScore != null && result.score.overall < policy.minScore) {
    violations.push({
      rule: 'minScore',
      message: `Score ${result.score.overall} is below minimum ${policy.minScore}`,
      severity: 'error'
    });
  }

  if (policy.maxErrors != null) {
    const errorCount = countBySeverity(result, 'error');
    if (errorCount > policy.maxErrors) {
      violations.push({
        rule: 'maxErrors',
        message: `${errorCount} errors found, max allowed is ${policy.maxErrors}`,
        severity: 'error'
      });
    }
  }

  if (policy.maxWarnings != null) {
    const warnCount = countBySeverity(result, 'warning');
    if (warnCount > policy.maxWarnings) {
      violations.push({
        rule: 'maxWarnings',
        message: `${warnCount} warnings found, max allowed is ${policy.maxWarnings}`,
        severity: 'warning'
      });
    }
  }

  if (policy.requiredChecks) {
    const ran = new Set(result.checks.map(c => c.id));
    for (const id of policy.requiredChecks) {
      if (!ran.has(id)) {
        violations.push({
          rule: 'requiredChecks',
          message: `Required check '${id}' was not run`,
          severity: 'error'
        });
      }
    }
  }

  if (policy.requireCompliance && result.compliance && !result.compliance.compliant) {
    violations.push({
      rule: 'requireCompliance',
      message: 'NTIA compliance is required but SBOM is non-compliant',
      severity: 'error'
    });
  }

  return {
    passed: violations.filter(v => v.severity === 'error').length === 0,
    violations
  };
}

function countBySeverity(result, severity) {
  let count = 0;
  for (const check of result.checks) {
    for (const f of check.findings) {
      if (f.severity === severity) count++;
    }
  }
  return count;
}

module.exports = { evaluatePolicy };
