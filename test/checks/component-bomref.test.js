const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-bomref');

describe('component-bomref check', () => {
  it('passes with bom-ref', () => {
    const sbom = { components: [{ name: 'a', 'bom-ref': 'ref-a' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags missing bom-ref', () => {
    const sbom = { components: [{ name: 'a' }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('handles mixed components', () => {
    const sbom = { components: [{ name: 'a', 'bom-ref': 'x' }, { name: 'b' }] };
    assert.equal(check.run(sbom).length, 1);
  });
});
