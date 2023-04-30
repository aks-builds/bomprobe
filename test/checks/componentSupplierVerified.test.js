const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/componentSupplierVerified');

describe('component-supplier-verified', () => {
  it('passes supplier with name and URL', () => {
    const sbom = { components: [{ name: 'a', supplier: { name: 'ACME', url: 'https://acme.com' } }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('notes supplier without URL', () => {
    const sbom = { components: [{ name: 'a', supplier: { name: 'ACME' } }] };
    assert.ok(check.run(sbom).length > 0);
  });

  it('skips components without supplier', () => {
    const sbom = { components: [{ name: 'a' }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
