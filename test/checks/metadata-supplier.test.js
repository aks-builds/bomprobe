const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-supplier');

describe('metadata-supplier check', () => {
  it('passes with top-level supplier', () => {
    const sbom = { metadata: { supplier: { name: 'Acme' } }, components: [] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('passes with component supplier', () => {
    const sbom = { metadata: { component: { supplier: { name: 'Acme' } } }, components: [] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags missing supplier', () => {
    const sbom = { metadata: {}, components: [] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('handles missing metadata', () => {
    const sbom = { components: [] };
    assert.equal(check.run(sbom).length, 1);
  });
});
