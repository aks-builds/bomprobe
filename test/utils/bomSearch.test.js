const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { searchComponents, findByPurl, findByLicense, findBySupplier } = require('../../src/utils/bomSearch');

const sbom = {
  components: [
    { name: 'lodash', purl: 'pkg:npm/lodash@4.17.21', licenses: [{ license: { id: 'MIT' } }], supplier: { name: 'Lodash Team' } },
    { name: 'express', purl: 'pkg:npm/express@4.18', licenses: [{ license: { id: 'MIT' } }], supplier: { name: 'OpenJS Foundation' } },
    { name: 'react', purl: 'pkg:npm/react@18.2', licenses: [{ license: { id: 'MIT' } }], group: 'facebook' },
    { name: 'gpl-lib', licenses: [{ license: { id: 'GPL-3.0-only' } }] }
  ]
};

describe('bomSearch', () => {
  it('searches by name', () => {
    assert.equal(searchComponents(sbom, 'lodash').length, 1);
  });

  it('searches by purl', () => {
    assert.equal(searchComponents(sbom, 'npm/express').length, 1);
  });

  it('searches by group', () => {
    assert.equal(searchComponents(sbom, 'facebook').length, 1);
  });

  it('finds by purl pattern', () => {
    assert.equal(findByPurl(sbom, 'pkg:npm/.*@4').length, 2);
  });

  it('finds by license', () => {
    assert.equal(findByLicense(sbom, 'MIT').length, 3);
    assert.equal(findByLicense(sbom, 'GPL-3.0-only').length, 1);
  });

  it('finds by supplier', () => {
    assert.equal(findBySupplier(sbom, 'OpenJS').length, 1);
  });

  it('returns empty for no match', () => {
    assert.equal(searchComponents(sbom, 'nonexistent').length, 0);
  });
});
