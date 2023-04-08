const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-swid');

describe('component-swid check', () => {
  it('passes with SWID tag', () => {
    const sbom = { components: [{ name: 'a', swid: { tagId: 'x' } }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with PURL', () => {
    const sbom = { components: [{ name: 'a', purl: 'pkg:npm/a' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with CPE', () => {
    const sbom = { components: [{ name: 'a', cpe: 'cpe:2.3:a:vendor:product:1.0' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags component with no identifier', () => {
    const sbom = { components: [{ name: 'a' }] };
    assert.equal(check.run(sbom).length, 1);
  });
});
