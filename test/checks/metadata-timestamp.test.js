const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-timestamp');

describe('metadata-timestamp check', () => {
  it('passes when timestamp is present', () => {
    const sbom = { metadata: { timestamp: '2023-01-15T10:00:00Z' }, components: [] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports when timestamp is missing', () => {
    const sbom = { metadata: { timestamp: null }, components: [] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.match(findings[0].message, /timestamp/);
  });
});
