const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { evaluatePolicy } = require('../../src/utils/policy');

function makeResult(overrides = {}) {
  return {
    score: { overall: 7 },
    checks: [
      { id: 'component-name', findings: [] },
      { id: 'component-version', findings: [{ severity: 'error', message: 'missing' }] },
      { id: 'component-license', findings: [{ severity: 'warning', message: 'unknown' }] }
    ],
    compliance: { compliant: true },
    ...overrides
  };
}

describe('policy evaluation', () => {
  it('passes when all rules are met', () => {
    const result = makeResult();
    const policy = { minScore: 5, maxErrors: 5, maxWarnings: 5 };
    assert.ok(evaluatePolicy(result, policy).passed);
  });

  it('fails on minScore violation', () => {
    const result = makeResult({ score: { overall: 3 } });
    const policy = { minScore: 5 };
    const ev = evaluatePolicy(result, policy);
    assert.ok(!ev.passed);
    assert.ok(ev.violations.some(v => v.rule === 'minScore'));
  });

  it('fails on maxErrors violation', () => {
    const result = makeResult();
    const policy = { maxErrors: 0 };
    const ev = evaluatePolicy(result, policy);
    assert.ok(!ev.passed);
  });

  it('warns on maxWarnings violation but still passes', () => {
    const result = makeResult();
    const policy = { maxWarnings: 0 };
    const ev = evaluatePolicy(result, policy);
    assert.ok(ev.passed);
    assert.ok(ev.violations.length > 0);
  });

  it('fails on missing required checks', () => {
    const result = makeResult();
    const policy = { requiredChecks: ['component-name', 'nonexistent-check'] };
    const ev = evaluatePolicy(result, policy);
    assert.ok(!ev.passed);
  });

  it('fails when compliance is required but not met', () => {
    const result = makeResult({ compliance: { compliant: false } });
    const policy = { requireCompliance: true };
    const ev = evaluatePolicy(result, policy);
    assert.ok(!ev.passed);
  });

  it('passes compliance check when compliant', () => {
    const result = makeResult();
    const policy = { requireCompliance: true };
    assert.ok(evaluatePolicy(result, policy).passed);
  });

  it('handles empty policy', () => {
    const result = makeResult();
    assert.ok(evaluatePolicy(result, {}).passed);
  });
});
