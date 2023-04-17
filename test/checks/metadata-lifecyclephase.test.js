const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-lifecyclephase');

describe('metadata-lifecyclephase check', () => {
  it('passes with lifecycle phase declared', () => {
    const sbom = { metadata: { lifecycles: [{ phase: 'build' }] } };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with lifecycle property', () => {
    const sbom = { metadata: { properties: [{ name: 'lifecycle-phase', value: 'post-build' }] } };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags missing lifecycle phase', () => {
    const sbom = { metadata: {} };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.ok(findings[0].message.includes('does not declare'));
  });

  it('flags non-standard phase', () => {
    const sbom = { metadata: { lifecycles: [{ phase: 'custom-phase' }] } };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.ok(findings[0].message.includes('Non-standard'));
  });

  it('allows all valid phases', () => {
    const phases = ['pre-build', 'build', 'post-build', 'operations', 'discovery', 'decommission'];
    for (const phase of phases) {
      const sbom = { metadata: { lifecycles: [{ phase }] } };
      assert.equal(check.run(sbom).length, 0, `${phase} should be valid`);
    }
  });
});
