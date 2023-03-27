const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { filterComponents, withoutLicense, withoutPurl, withoutSupplier, byType } = require('../../src/utils/filter');

const sbom = {
  components: [
    { name: 'a', license: 'MIT', purl: 'pkg:npm/a@1', supplier: 'x', type: 'library' },
    { name: 'b', license: null, purl: null, supplier: null, type: 'framework' },
    { name: 'c', license: 'Apache-2.0', purl: 'pkg:npm/c@1', supplier: null, type: 'library' }
  ]
};

describe('filter utilities', () => {
  it('filters by custom predicate', () => {
    const result = filterComponents(sbom, c => c.name === 'a');
    assert.equal(result.length, 1);
    assert.equal(result[0].name, 'a');
  });

  it('finds components without license', () => {
    const result = withoutLicense(sbom);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, 'b');
  });

  it('finds components without purl', () => {
    const result = withoutPurl(sbom);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, 'b');
  });

  it('finds components without supplier', () => {
    const result = withoutSupplier(sbom);
    assert.equal(result.length, 2);
  });

  it('filters by type', () => {
    const result = byType(sbom, 'library');
    assert.equal(result.length, 2);
  });

  it('returns empty for unknown type', () => {
    assert.equal(byType(sbom, 'application').length, 0);
  });
});
