const REQUIRED_CHECKS = [
  'component-name',
  'component-version',
  'component-supplier',
  'component-purl',
  'metadata-author',
  'metadata-timestamp',
  'dependency-coverage'
];

function evaluate(checkResults) {
  const passed = [];
  const failed = [];

  for (const id of REQUIRED_CHECKS) {
    const result = checkResults.find(r => r.id === id);
    if (!result) {
      failed.push({ id, reason: 'Check not found' });
      continue;
    }
    if (result.findings.length === 0) {
      passed.push(id);
    } else {
      failed.push({
        id,
        reason: result.findings[0].message,
        count: result.findings.length
      });
    }
  }

  return {
    profile: 'ntia',
    name: 'NTIA Minimum Elements',
    compliant: failed.length === 0,
    passed,
    failed,
    summary: `${passed.length}/${REQUIRED_CHECKS.length} checks passed`
  };
}

module.exports = { evaluate, REQUIRED_CHECKS };
