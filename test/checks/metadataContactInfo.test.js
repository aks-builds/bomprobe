const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadataContactInfo');

describe('metadata-contact-info', () => {
  it('passes with author email', () => {
    const sbom = { metadata: { authors: [{ name: 'dev', email: 'dev@example.com' }] } };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with supplier contact', () => {
    const sbom = { metadata: { supplier: { contact: [{ email: 'sec@acme.com' }] } } };
    assert.equal(check.run(sbom).length, 0);
  });

  it('notes missing contact info', () => {
    const sbom = { metadata: {} };
    assert.ok(check.run(sbom).length > 0);
  });

  it('handles no metadata', () => {
    assert.ok(check.run({}).length > 0);
  });
});
