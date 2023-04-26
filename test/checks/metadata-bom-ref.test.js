const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-bom-ref');

describe('metadata-bom-ref check', () => {
  it('passes unique bom-refs', () => {
    const sbom = { components: [
      { name: 'a', 'bom-ref': 'ref-a' },
      { name: 'b', 'bom-ref': 'ref-b' }
    ]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags duplicate bom-refs', () => {
    const sbom = { components: [
      { name: 'a', 'bom-ref': 'ref-dup' },
      { name: 'b', 'bom-ref': 'ref-dup' }
    ]};
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('Duplicate'));
  });

  it('skips components without bom-ref', () => {
    assert.equal(check.run({ components: [{ name: 'a' }] }).length, 0);
  });

  it('handles empty components', () => {
    assert.equal(check.run({ components: [] }).length, 0);
  });
});
