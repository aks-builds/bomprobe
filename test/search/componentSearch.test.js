const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { searchComponents, findByPurl, findByLicense, findByType, findByScope, findMissing } = require('../../src/search/componentSearch');

const sbom = {
  components: [
    { name: 'express', version: '4.18.2', type: 'library', purl: 'pkg:npm/express@4.18.2', scope: 'required', licenses: [{ license: { id: 'MIT' } }], hashes: [{ alg: 'SHA-256', content: 'abc' }] },
    { name: 'lodash', version: '4.17.21', type: 'library', purl: 'pkg:npm/lodash@4.17.21', scope: 'optional', licenses: [{ license: { id: 'MIT' } }] },
    { name: 'react', version: '18.2.0', type: 'framework', purl: 'pkg:npm/react@18.2.0', scope: 'required', licenses: [{ license: { id: 'MIT' } }] },
    { name: 'gpl-lib', version: '1.0.0', type: 'library', licenses: [{ license: { id: 'GPL-3.0-only' } }] }
  ]
};

describe('searchComponents', () => {
  it('finds by name', () => {
    const r = searchComponents(sbom, 'express');
    assert.equal(r.length, 1);
    assert.equal(r[0].name, 'express');
  });

  it('finds by partial match', () => {
    const r = searchComponents(sbom, 'lod');
    assert.equal(r.length, 1);
  });

  it('supports multi-term search', () => {
    const r = searchComponents(sbom, 'express 4.18');
    assert.equal(r.length, 1);
  });

  it('returns all for empty query', () => {
    assert.equal(searchComponents(sbom, '').length, 4);
  });
});

describe('findByPurl', () => {
  it('finds by purl pattern', () => {
    const r = findByPurl(sbom, 'npm/react');
    assert.equal(r.length, 1);
    assert.equal(r[0].name, 'react');
  });
});

describe('findByLicense', () => {
  it('finds by license id', () => {
    const r = findByLicense(sbom, 'GPL');
    assert.equal(r.length, 1);
    assert.equal(r[0].name, 'gpl-lib');
  });

  it('finds MIT components', () => {
    const r = findByLicense(sbom, 'MIT');
    assert.equal(r.length, 3);
  });
});

describe('findByType', () => {
  it('finds frameworks', () => {
    const r = findByType(sbom, 'framework');
    assert.equal(r.length, 1);
    assert.equal(r[0].name, 'react');
  });
});

describe('findByScope', () => {
  it('finds optional deps', () => {
    const r = findByScope(sbom, 'optional');
    assert.equal(r.length, 1);
    assert.equal(r[0].name, 'lodash');
  });
});

describe('findMissing', () => {
  it('finds components without purl', () => {
    const r = findMissing(sbom, 'purl');
    assert.equal(r.length, 1);
    assert.equal(r[0].name, 'gpl-lib');
  });

  it('finds components without hash', () => {
    const r = findMissing(sbom, 'hash');
    assert.equal(r.length, 3);
  });
});
