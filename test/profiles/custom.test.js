const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { createProfile } = require('../../src/profiles/custom');

describe('custom profile', () => {
  const checks = [
    { id: 'component-name', findings: [] },
    { id: 'component-version', findings: [{ severity: 'error', message: 'x' }] },
    { id: 'component-license', findings: [{ severity: 'warning', message: 'x' }] }
  ];

  it('marks compliant when all required checks pass', () => {
    const profile = createProfile('test', ['component-name', 'component-license']);
    const result = profile.evaluate(checks);
    assert.ok(result.compliant);
    assert.equal(result.passed.length, 2);
  });

  it('marks non-compliant when a required check has errors', () => {
    const profile = createProfile('test', ['component-name', 'component-version']);
    const result = profile.evaluate(checks);
    assert.ok(!result.compliant);
    assert.ok(result.failed.includes('component-version'));
  });

  it('fails missing checks', () => {
    const profile = createProfile('test', ['nonexistent-check']);
    const result = profile.evaluate(checks);
    assert.ok(!result.compliant);
    assert.ok(result.failed.includes('nonexistent-check'));
  });

  it('includes profile name in result', () => {
    const profile = createProfile('my-policy', ['component-name']);
    const result = profile.evaluate(checks);
    assert.equal(result.profile, 'my-policy');
  });

  it('provides summary string', () => {
    const profile = createProfile('test', ['component-name']);
    const result = profile.evaluate(checks);
    assert.ok(result.summary.includes('1/1'));
  });
});
