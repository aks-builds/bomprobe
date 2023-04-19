const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-patch-status');

describe('component-patch-status check', () => {
  it('passes component without patches', () => {
    const sbom = { components: [{ name: 'a' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes patch with type', () => {
    const sbom = { components: [{ name: 'a', pedigree: { patches: [{ type: 'unofficial' }] } }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags patch without type', () => {
    const sbom = { components: [{ name: 'lib', pedigree: { patches: [{ resolves: [] }] } }] };
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('without a type'));
  });

  it('handles empty patches array', () => {
    const sbom = { components: [{ name: 'a', pedigree: { patches: [] } }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
