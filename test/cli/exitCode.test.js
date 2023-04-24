const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { determineExitCode, EXIT_CODES } = require('../../src/cli/exitCode');

describe('exit code determination', () => {
  it('returns SUCCESS for clean results', () => {
    const result = { results: [{ findings: [] }] };
    assert.equal(determineExitCode(result), EXIT_CODES.SUCCESS);
  });

  it('returns FINDINGS on error severity', () => {
    const result = { results: [{ findings: [{ severity: 'error', message: 'e' }] }] };
    assert.equal(determineExitCode(result), EXIT_CODES.FINDINGS);
  });

  it('ignores warnings by default', () => {
    const result = { results: [{ findings: [{ severity: 'warning', message: 'w' }] }] };
    assert.equal(determineExitCode(result), EXIT_CODES.SUCCESS);
  });

  it('fails on warnings when failOn is warning', () => {
    const result = { results: [{ findings: [{ severity: 'warning', message: 'w' }] }] };
    assert.equal(determineExitCode(result, { failOn: 'warning' }), EXIT_CODES.FINDINGS);
  });

  it('fails on any finding when failOn is any', () => {
    const result = { results: [{ findings: [{ severity: 'info', message: 'i' }] }] };
    assert.equal(determineExitCode(result, { failOn: 'any' }), EXIT_CODES.FINDINGS);
  });

  it('returns POLICY_VIOLATION for policy failures', () => {
    const result = { results: [], policyViolations: [{ rule: 'x' }] };
    assert.equal(determineExitCode(result), EXIT_CODES.POLICY_VIOLATION);
  });

  it('returns FINDINGS when score below threshold', () => {
    const result = { score: 60, results: [] };
    assert.equal(determineExitCode(result, { threshold: 80 }), EXIT_CODES.FINDINGS);
  });

  it('returns INPUT_ERROR for null result', () => {
    assert.equal(determineExitCode(null), EXIT_CODES.INPUT_ERROR);
  });
});
