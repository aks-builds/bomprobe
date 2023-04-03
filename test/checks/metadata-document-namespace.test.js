const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-document-namespace');

describe('metadata-document-namespace check', () => {
  it('passes SBOM with valid namespace URI', () => {
    const sbom = { metadata: { documentNamespace: 'https://example.com/sbom/1234', serialNumber: null } };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes SBOM with serial number only', () => {
    const sbom = { metadata: { documentNamespace: null, serialNumber: 'urn:uuid:abc-123' } };
    assert.equal(check.run(sbom).length, 0);
  });

  it('reports when both namespace and serial are missing', () => {
    const sbom = { metadata: { documentNamespace: null, serialNumber: null } };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'error');
  });

  it('warns on non-URI namespace', () => {
    const sbom = { metadata: { documentNamespace: 'not-a-uri', serialNumber: null } };
    const findings = check.run(sbom);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'warning');
  });
});
