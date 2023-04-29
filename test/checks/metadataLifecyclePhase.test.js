const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadataLifecyclePhase');

describe('metadata-lifecycle-phase', () => {
  it('passes when lifecycle is declared', () => {
    const sbom = { metadata: { lifecycles: [{ phase: 'build' }] }, components: [] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('warns on missing lifecycle', () => {
    const sbom = { metadata: {}, components: [] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'info');
  });

  it('warns on unknown lifecycle phase', () => {
    const sbom = { metadata: { lifecycles: [{ phase: 'custom-phase' }] }, components: [] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.ok(findings[0].message.includes('Unknown'));
  });

  it('handles string lifecycle format', () => {
    const sbom = { metadata: { lifecycle: 'build' }, components: [] };
    assert.equal(check.run(sbom).length, 0);
  });
});
