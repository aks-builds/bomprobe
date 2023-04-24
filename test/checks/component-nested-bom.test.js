const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-nested-bom');

describe('component-nested-bom check', () => {
  it('passes clean nested components', () => {
    const sbom = { components: [
      { name: 'parent', 'bom-ref': 'p', components: [{ name: 'child', 'bom-ref': 'c' }] }
    ]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags duplicate bom-ref in nested', () => {
    const sbom = { components: [
      { name: 'a', 'bom-ref': 'ref-1' },
      { name: 'b', components: [{ name: 'dup', 'bom-ref': 'ref-1' }] }
    ]};
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('duplicates'));
  });

  it('flags anonymous nested component', () => {
    const sbom = { components: [
      { name: 'parent', components: [{}] }
    ]};
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('no name'));
  });

  it('handles no nested components', () => {
    const sbom = { components: [{ name: 'a' }] };
    assert.equal(check.run(sbom).length, 0);
  });
});
