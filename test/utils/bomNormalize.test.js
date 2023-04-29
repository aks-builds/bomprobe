const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { normalizeComponentNames, normalizeVersions, normalizeLicenses } = require('../../src/utils/bomNormalize');

describe('bomNormalize', () => {
  it('lowercases component names', () => {
    const sbom = { components: [{ name: ' Lodash ', group: ' NPM ' }] };
    const result = normalizeComponentNames(sbom);
    assert.equal(result.components[0].name, 'lodash');
    assert.equal(result.components[0].group, 'npm');
  });

  it('strips v prefix from versions', () => {
    const sbom = { components: [{ name: 'a', version: 'v1.2.3' }] };
    const result = normalizeVersions(sbom);
    assert.equal(result.components[0].version, '1.2.3');
  });

  it('trims license ids', () => {
    const sbom = { components: [{ name: 'a', licenses: [
      { license: { id: ' MIT ' } }
    ]}] };
    const result = normalizeLicenses(sbom);
    assert.equal(result.components[0].licenses[0].license.id, 'MIT');
  });

  it('does not mutate original', () => {
    const sbom = { components: [{ name: 'A' }] };
    normalizeComponentNames(sbom);
    assert.equal(sbom.components[0].name, 'A');
  });
});
