const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/metadata-properties');

describe('metadata-properties check', () => {
  it('passes when properties exist', () => {
    const sbom = { metadata: { properties: [{ name: 'build:ci', value: 'jenkins' }] }, components: [] };
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags missing properties', () => {
    const sbom = { metadata: {}, components: [] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('flags empty properties array', () => {
    const sbom = { metadata: { properties: [] }, components: [] };
    assert.equal(check.run(sbom).length, 1);
  });

  it('handles missing metadata', () => {
    const sbom = { components: [] };
    assert.equal(check.run(sbom).length, 1);
  });
});
