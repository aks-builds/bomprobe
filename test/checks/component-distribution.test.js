const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-distribution');

describe('component-distribution check', () => {
  it('passes with distribution ref', () => {
    const sbom = { components: [{ name: 'a', externalReferences: [{ type: 'distribution', url: 'https://x' }] }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with purl as fallback', () => {
    const sbom = { components: [{ name: 'a', purl: 'pkg:npm/a@1' }] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags component with neither', () => {
    const sbom = { components: [{ name: 'bare', type: 'library' }] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('skips data type', () => {
    assert.equal(check.run({ components: [{ name: 'x', type: 'data' }] }).length, 0);
  });
});
