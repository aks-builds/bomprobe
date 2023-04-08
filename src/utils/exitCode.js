const EXIT_CODES = {
  SUCCESS: 0,
  FINDINGS: 1,
  ERROR: 2,
  CONFIG_ERROR: 3,
  FILE_NOT_FOUND: 4,
  PARSE_ERROR: 5,
  POLICY_VIOLATION: 6
};

function determineExitCode(result, options = {}) {
  const failOn = options.failOn || 'error';

  let hasError = false;
  let hasWarning = false;

  for (const check of result.checks) {
    for (const f of check.findings) {
      if (f.severity === 'error') hasError = true;
      if (f.severity === 'warning') hasWarning = true;
    }
  }

  if (failOn === 'error' && hasError) return EXIT_CODES.FINDINGS;
  if (failOn === 'warning' && (hasError || hasWarning)) return EXIT_CODES.FINDINGS;
  if (failOn === 'any' && (hasError || hasWarning)) return EXIT_CODES.FINDINGS;
  if (failOn === 'none') return EXIT_CODES.SUCCESS;

  return EXIT_CODES.SUCCESS;
}

module.exports = { EXIT_CODES, determineExitCode };
