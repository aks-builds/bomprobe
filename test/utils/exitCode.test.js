const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { EXIT_CODES, determineExitCode } = require('../../src/utils/exitCode');

describe('exit code determination', () => {
  const cleanResult = { checks: [{ findings: [] }] };
  const errorResult = { checks: [{ findings: [{ severity: 'error', message: 'x' }] }] };
  const warnResult = { checks: [{ findings: [{ severity: 'warning', message: 'x' }] }] };

  it('returns SUCCESS for clean results', () => {
    assert.equal(determineExitCode(cleanResult), EXIT_CODES.SUCCESS);
  });

  it('returns FINDINGS for errors with default failOn', () => {
    assert.equal(determineExitCode(errorResult), EXIT_CODES.FINDINGS);
  });

  it('returns SUCCESS for warnings with default failOn', () => {
    assert.equal(determineExitCode(warnResult), EXIT_CODES.SUCCESS);
  });

  it('returns FINDINGS for warnings when failOn is warning', () => {
    assert.equal(determineExitCode(warnResult, { failOn: 'warning' }), EXIT_CODES.FINDINGS);
  });

  it('returns SUCCESS when failOn is none', () => {
    assert.equal(determineExitCode(errorResult, { failOn: 'none' }), EXIT_CODES.SUCCESS);
  });

  it('exports all exit code constants', () => {
    assert.equal(EXIT_CODES.SUCCESS, 0);
    assert.equal(EXIT_CODES.ERROR, 2);
    assert.equal(EXIT_CODES.POLICY_VIOLATION, 6);
  });
});
