const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-patch-diff');

describe('component-patch-diff check', () => {
  it('passes components without patches', () => {
    const sbom = { components: [{ name: 'a' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes patch with diff URL', () => {
    const sbom = { components: [{ name: 'a', pedigree: { patches: [{ diff: { url: 'https://example.com/diff' } }] } }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags patch without diff', () => {
    const sbom = { components: [{ name: 'a', pedigree: { patches: [{ type: 'unofficial' }] } }] };
    assert.equal(check.run(sbom).length, 1);
  });
});
