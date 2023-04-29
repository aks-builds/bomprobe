const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-supplier-contact');

describe('component-supplier-contact check', () => {
  it('passes with supplier URL', () => {
    const sbom = { components: [{ name: 'a', supplier: { name: 'Acme', url: ['https://acme.com'] } }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with supplier email', () => {
    const sbom = { components: [{ name: 'a', supplier: { name: 'Acme', contact: [{ email: 'x@y.com' }] } }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags supplier with no contact', () => {
    const sbom = { components: [{ name: 'a', supplier: { name: 'Acme' } }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('skips components without supplier', () => {
    assert.equal(check.run({ components: [{ name: 'a' }] }).length, 0);
  });
});
