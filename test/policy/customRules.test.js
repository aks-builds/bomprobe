const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { validatePolicy, evaluateRule, runPolicy, resolveField } = require('../../src/policy/customRules');

describe('custom policy rules', () => {
  it('validates policy structure', () => {
    assert.throws(() => validatePolicy({}), /rules/);
    assert.throws(() => validatePolicy({ rules: [{}] }), /id/);
    assert.throws(() => validatePolicy({ rules: [{ id: 'r1' }] }), /field/);
  });

  it('resolves nested fields', () => {
    const obj = { a: { b: { c: 42 } } };
    assert.equal(resolveField(obj, 'a.b.c'), 42);
    assert.equal(resolveField(obj, 'a.x'), undefined);
  });

  it('evaluates exists operator', () => {
    assert.ok(evaluateRule({ field: 'name', operator: 'exists' }, { name: 'foo' }));
    assert.ok(!evaluateRule({ field: 'name', operator: 'exists' }, {}));
  });

  it('evaluates equals and contains operators', () => {
    assert.ok(evaluateRule({ field: 'type', operator: 'equals', value: 'library' }, { type: 'library' }));
    assert.ok(evaluateRule({ field: 'purl', operator: 'contains', value: 'npm' }, { purl: 'pkg:npm/foo@1' }));
  });

  it('evaluates matches operator with regex', () => {
    assert.ok(evaluateRule({ field: 'version', operator: 'matches', value: '^\\d+\\.\\d+' }, { version: '1.2.3' }));
  });

  it('runs policy against SBOM components', () => {
    const policy = {
      rules: [
        { id: 'must-have-purl', field: 'purl', operator: 'exists', severity: 'error' }
      ]
    };
    const sbom = {
      components: [
        { name: 'foo', purl: 'pkg:npm/foo@1' },
        { name: 'bar' }
      ]
    };
    const findings = runPolicy(policy, sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].component, 'bar');
    assert.equal(findings[0].severity, 'error');
  });

  it('runs policy against metadata target', () => {
    const policy = {
      rules: [
        { id: 'must-have-timestamp', field: 'timestamp', operator: 'exists', target: 'metadata' }
      ]
    };
    const findings = runPolicy(policy, { metadata: {}, components: [] });
    assert.equal(findings.length, 1);
  });

  it('supports in operator', () => {
    const rule = { field: 'type', operator: 'in', value: ['library', 'framework'] };
    assert.ok(evaluateRule(rule, { type: 'library' }));
    assert.ok(!evaluateRule(rule, { type: 'application' }));
  });
});
