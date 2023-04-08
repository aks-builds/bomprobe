const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-manufacture');

describe('metadata-manufacture check', () => {
  it('passes with metadata.component', () => {
    const sbom = { metadata: { component: { name: 'app' } }, components: [] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with build lifecycle', () => {
    const sbom = { metadata: { lifecycles: [{ phase: 'build' }] }, components: [] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags missing manufacture context', () => {
    const sbom = { metadata: {}, components: [] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('handles missing metadata', () => {
    const sbom = { components: [] };
    assert.equal(check.run(sbom).length, 1);
  });
});
