const REQUIRED_CHECKS = [
  'component-name',
  'component-version',
  'component-supplier',
  'component-license',
  'component-purl',
  'component-hashes',
  'metadata-author',
  'metadata-timestamp',
  'metadata-tools',
  'dependency-coverage',
  'unique-purls'
];

function evaluate(checkResults) {
  const passed = [];
  const failed = [];

  for (const id of REQUIRED_CHECKS) {
    const result = checkResults.find(r => r.id === id);
    if (!result) {
      failed.push(id);
      continue;
    }
    const hasIssues = result.findings.some(
      f => f.severity === 'error' || f.severity === 'warning'
    );
    if (hasIssues) {
      failed.push(id);
    } else {
      passed.push(id);
    }
  }

  const compliant = failed.length === 0;
  const summary = compliant
    ? `BSI TR-03183 compliant (${passed.length}/${REQUIRED_CHECKS.length} checks passed)`
    : `BSI TR-03183 non-compliant (${passed.length}/${REQUIRED_CHECKS.length} checks passed, ${failed.length} failed)`;

  return { compliant, passed, failed, summary };
}

module.exports = { evaluate, REQUIRED_CHECKS };
