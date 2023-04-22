const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/spdx-external-document-refs');

describe('spdx-external-document-refs check', () => {
  it('passes complete external ref', () => {
    const sbom = { externalDocumentRefs: [{
      externalDocumentId: 'DocumentRef-ext',
      spdxDocument: 'https://example.com/sbom.spdx',
      checksum: { algorithm: 'SHA256', checksumValue: 'abc123' }
    }]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags missing spdxDocument', () => {
    const sbom = { externalDocumentRefs: [{ externalDocumentId: 'DocumentRef-ext' }] };
    const findings = check.run(sbom);
    assert.ok(findings.some(f => f.message.includes('missing spdxDocument')));
  });

  it('flags missing checksum', () => {
    const sbom = { externalDocumentRefs: [{
      externalDocumentId: 'DocumentRef-ext',
      spdxDocument: 'https://example.com/sbom.spdx'
    }]};
    assert.ok(check.run(sbom).some(f => f.message.includes('missing checksum')));
  });

  it('handles no external refs', () => {
    assert.equal(check.run({}).length, 0);
  });
});
