const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-license');

describe('metadata-license check', () => {
  it('passes when document license is present', () => {
    const sbom = { metadata: { documentLicense: 'CC0-1.0' }, components: [] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports when document license is missing', () => {
    const sbom = { metadata: { documentLicense: null }, components: [] };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'info');
  });
});
