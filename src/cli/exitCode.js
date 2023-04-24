const EXIT_CODES = {
  SUCCESS: 0,
  FINDINGS: 1,
  POLICY_VIOLATION: 2,
  INPUT_ERROR: 3,
  CONFIG_ERROR: 4
};

function determineExitCode(result, options = {}) {
  if (!result) return EXIT_CODES.INPUT_ERROR;

  const failOn = options.failOn || 'error';
  const threshold = options.threshold || 0;

  if (result.policyViolations?.length > 0) {
    return EXIT_CODES.POLICY_VIOLATION;
  }

  if (typeof result.score === 'number' && threshold > 0 && result.score < threshold) {
    return EXIT_CODES.FINDINGS;
  }

  const findings = collectFindings(result);
  if (failOn === 'error' && findings.some(f => f.severity === 'error')) {
    return EXIT_CODES.FINDINGS;
  }
  if (failOn === 'warning' && findings.some(f => f.severity === 'error' || f.severity === 'warning')) {
    return EXIT_CODES.FINDINGS;
  }
  if (failOn === 'any' && findings.length > 0) {
    return EXIT_CODES.FINDINGS;
  }

  return EXIT_CODES.SUCCESS;
}

function collectFindings(result) {
  const all = [];
  for (const r of (result.results || [])) {
    for (const f of (r.findings || [])) {
      all.push(f);
    }
  }
  return all;
}

module.exports = { determineExitCode, EXIT_CODES };
