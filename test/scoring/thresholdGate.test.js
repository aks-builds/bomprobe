const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { evaluateThreshold, evaluateFailOn } = require('../../src/scoring/thresholdGate');

describe('threshold gate', () => {
  it('passes when score meets threshold', () => {
    const r = evaluateThreshold(85, 80);
    assert.ok(r.passed);
    assert.equal(r.exitCode, 0);
  });

  it('fails when score below threshold', () => {
    const r = evaluateThreshold(70, 80);
    assert.ok(!r.passed);
    assert.equal(r.exitCode, 1);
    assert.ok(r.reason.includes('below'));
  });

  it('passes with no threshold', () => {
    const r = evaluateThreshold(50, undefined);
    assert.ok(r.passed);
  });

  it('failOn error triggers on error finding', () => {
    const r = evaluateFailOn([{ severity: 'error' }], 'error');
    assert.ok(r.failed);
  });

  it('failOn warning triggers on warning', () => {
    const r = evaluateFailOn([{ severity: 'warning' }], 'warning');
    assert.ok(r.failed);
  });

  it('failOn none never triggers', () => {
    const r = evaluateFailOn([{ severity: 'error' }], 'none');
    assert.ok(!r.failed);
  });

  it('failOn error ignores warnings', () => {
    const r = evaluateFailOn([{ severity: 'warning' }], 'error');
    assert.ok(!r.failed);
  });
});
