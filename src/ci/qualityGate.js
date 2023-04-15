const { evaluateCompliance } = require('../compliance/profiles');
const { evaluatePolicy } = require('../utils/policy');
const { evaluateThresholds } = require('../utils/threshold');

function runQualityGate(result, config = {}) {
  const gates = [];

  if (config.compliance) {
    const evaluation = evaluateCompliance(result.checks || [], config.compliance);
    gates.push({
      name: `${config.compliance} compliance`,
      passed: evaluation.compliant,
      details: evaluation.compliant
        ? `Compliant (${evaluation.score}%)`
        : `Non-compliant: ${evaluation.failed.length} check(s) failed`
    });
  }

  if (config.policy) {
    const evaluation = evaluatePolicy(result, config.policy);
    gates.push({
      name: 'policy',
      passed: evaluation.passed,
      details: evaluation.passed
        ? 'All policy rules satisfied'
        : `${evaluation.violations.length} violation(s): ${evaluation.violations.join(', ')}`
    });
  }

  if (config.thresholds) {
    const evaluation = evaluateThresholds(result, config.thresholds);
    gates.push({
      name: 'thresholds',
      passed: evaluation.passed,
      details: evaluation.passed
        ? 'All thresholds met'
        : `${evaluation.violations.length} threshold(s) breached`
    });
  }

  const allPassed = gates.every(g => g.passed);
  return { passed: allPassed, gates };
}

function formatGateResult(gateResult) {
  const lines = [];
  const status = gateResult.passed ? 'PASSED' : 'FAILED';
  lines.push(`Quality Gate: ${status}`);
  lines.push('');
  for (const gate of gateResult.gates) {
    const icon = gate.passed ? '[PASS]' : '[FAIL]';
    lines.push(`  ${icon} ${gate.name}: ${gate.details}`);
  }
  return lines.join('\n');
}

module.exports = { runQualityGate, formatGateResult };
