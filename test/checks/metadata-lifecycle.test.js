const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-lifecycle');

describe('metadata-lifecycle check', () => {
  it('passes when both author and timestamp present', () => {
    const sbom = { metadata: { author: 'x', timestamp: '2023-01-01' } };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports info when only timestamp', () => {
    const sbom = { metadata: { author: null, timestamp: '2023-01-01' } };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'info');
  });

  it('reports info when only author', () => {
    const sbom = { metadata: { author: 'x', timestamp: null } };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'info');
  });

  it('reports warning when neither present', () => {
    const sbom = { metadata: { author: null, timestamp: null } };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'warning');
  });
});
