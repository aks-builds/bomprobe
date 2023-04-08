function formatCompliance(evaluation) {
  if (evaluation.error) return `Error: ${evaluation.error}`;

  const lines = [];
  lines.push(`Compliance Profile: ${evaluation.profile}`);
  lines.push(`Status: ${evaluation.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}`);
  lines.push(`Score: ${evaluation.score}%`);
  lines.push('');

  if (evaluation.passed.length > 0) {
    lines.push('Passed checks:');
    for (const id of evaluation.passed) {
      lines.push(`  [PASS] ${id}`);
    }
  }

  if (evaluation.failed.length > 0) {
    lines.push('');
    lines.push('Failed checks:');
    for (const f of evaluation.failed) {
      lines.push(`  [FAIL] ${f.id} - ${f.reason}`);
    }
  }

  return lines.join('\n');
}

function complianceToJson(evaluation) {
  return JSON.stringify(evaluation, null, 2);
}

module.exports = { formatCompliance, complianceToJson };
