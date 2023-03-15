const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-serial-number');

describe('metadata-serial-number check', () => {
  it('passes when serial number present', () => {
    const sbom = { metadata: { serialNumber: 'urn:uuid:abc-123' } };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes when document namespace present', () => {
    const sbom = { metadata: { documentNamespace: 'https://example.com/sbom' } };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports when neither is present', () => {
    const sbom = { metadata: {} };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'warning');
  });
});
