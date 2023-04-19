const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { evaluatePolicy } = require('../../src/policy/evaluator');

describe('policy evaluator', () => {
  const result = {
    score: 85,
    grade: 'B',
    results: [
      { name: 'a', findings: [{ severity: 'warning', message: 'w' }] },
      { name: 'b', findings: [{ severity: 'error', message: 'e' }, { severity: 'info', message: 'i' }] }
    ]
  };

  it('passes when score meets threshold', () => {
    const policy = [{ field: 'score', operator: 'gte', value: 80 }];
    const evaluation = evaluatePolicy(result, policy);
    assert.equal(evaluation.pass, true);
  });

  it('fails when score below threshold', () => {
    const policy = [{ field: 'score', operator: 'gte', value: 90 }];
    const evaluation = evaluatePolicy(result, policy);
    assert.equal(evaluation.pass, false);
    assert.equal(evaluation.violations.length, 1);
  });

  it('checks grade membership', () => {
    const policy = [{ field: 'grade', operator: 'in', value: ['A', 'B'] }];
    const evaluation = evaluatePolicy(result, policy);
    assert.equal(evaluation.pass, true);
  });

  it('checks error count', () => {
    const policy = [{ field: 'errorCount', operator: 'eq', value: 0 }];
    const evaluation = evaluatePolicy(result, policy);
    assert.equal(evaluation.pass, false);
  });

  it('handles object score', () => {
    const r = { ...result, score: { overall: 85 } };
    const policy = [{ field: 'score', operator: 'gte', value: 80 }];
    assert.equal(evaluatePolicy(r, policy).pass, true);
  });

  it('provides summary message', () => {
    const policy = [{ field: 'score', operator: 'gte', value: 90 }];
    const evaluation = evaluatePolicy(result, policy);
    assert.ok(evaluation.summary.includes('violation'));
  });

  it('skips rules for unknown fields', () => {
    const policy = [{ field: 'nonexistent', operator: 'eq', value: 1 }];
    const evaluation = evaluatePolicy(result, policy);
    assert.equal(evaluation.pass, true);
  });
});
