const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { searchComponents, findByPurl, findByName } = require('../../src/utils/search');

const components = [
  { name: 'lodash', version: '4.17.21', purl: 'pkg:npm/lodash@4.17.21' },
  { name: 'express', version: '4.18.2', purl: 'pkg:npm/express@4.18.2' },
  { name: 'react', version: '18.2.0', purl: 'pkg:npm/react@18.2.0' }
];

describe('component search', () => {
  it('searches by name', () => {
    assert.equal(searchComponents(components, 'lodash').length, 1);
  });

  it('searches case-insensitive', () => {
    assert.equal(searchComponents(components, 'LODASH').length, 1);
  });

  it('searches by purl fragment', () => {
    assert.equal(searchComponents(components, 'npm/react').length, 1);
  });

  it('returns empty for no match', () => {
    assert.equal(searchComponents(components, 'nonexistent').length, 0);
  });

  it('finds by exact purl', () => {
    assert.equal(findByPurl(components, 'pkg:npm/express@4.18.2').name, 'express');
  });

  it('returns null for missing purl', () => {
    assert.equal(findByPurl(components, 'pkg:npm/missing@1.0'), null);
  });

  it('finds by name', () => {
    assert.equal(findByName(components, 'react').length, 1);
  });
});
