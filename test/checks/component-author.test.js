const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-author');

describe('component-author check', () => {
  it('passes with author', () => {
    const sbom = { components: [{ name: 'a', author: 'John Doe' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with publisher', () => {
    const sbom = { components: [{ name: 'a', publisher: 'Acme Corp' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with supplier', () => {
    const sbom = { components: [{ name: 'a', supplier: { name: 'Acme' } }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags component without any author info', () => {
    const sbom = { components: [{ name: 'orphan-lib' }] };
    assert.equal(check.run(sbom).length, 1);
  });
});
