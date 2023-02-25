const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { evaluate, REQUIRED_CHECKS } = require('../../src/profiles/bsi');

describe('BSI profile', () => {
  it('reports compliant when all required checks pass', () => {
    const checks = REQUIRED_CHECKS.map(id => ({ id, findings: [] }));
    const result = evaluate(checks);
    assert.equal(result.compliant, true);
    assert.equal(result.failed.length, 0);
  });

  it('reports non-compliant when checks have warnings', () => {
    const checks = REQUIRED_CHECKS.map(id => ({
      id,
      findings: id === 'component-name' ? [{ severity: 'warning', message: 'x' }] : []
    }));
    const result = evaluate(checks);
    assert.equal(result.compliant, false);
    assert.ok(result.failed.includes('component-name'));
  });

  it('reports missing checks as failures', () => {
    const result = evaluate([]);
    assert.equal(result.compliant, false);
    assert.equal(result.failed.length, REQUIRED_CHECKS.length);
  });

  it('allows info-severity findings', () => {
    const checks = REQUIRED_CHECKS.map(id => ({
      id,
      findings: [{ severity: 'info', message: 'note' }]
    }));
    const result = evaluate(checks);
    assert.equal(result.compliant, true);
  });

  it('includes summary string', () => {
    const checks = REQUIRED_CHECKS.map(id => ({ id, findings: [] }));
    const result = evaluate(checks);
    assert.ok(result.summary.includes('BSI'));
    assert.ok(result.summary.includes('compliant'));
  });
});
