const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-tools');

describe('metadata-tools check', () => {
  it('passes when tools are listed', () => {
    const sbom = { metadata: { toolCount: 2 }, components: [] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports when no tools are listed', () => {
    const sbom = { metadata: { toolCount: 0 }, components: [] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'info');
  });
});
