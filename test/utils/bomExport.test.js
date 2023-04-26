const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { exportComponentList } = require('../../src/utils/bomExport');

const sbom = {
  components: [
    { name: 'lodash', version: '4.17.21', type: 'library', purl: 'pkg:npm/lodash@4.17.21', licenses: [{ license: { id: 'MIT' } }], supplier: { name: 'JS Foundation' } },
    { name: 'express', version: '4.18.2', type: 'framework' }
  ]
};

describe('bomExport', () => {
  it('exports CSV with header', () => {
    const csv = exportComponentList(sbom, 'csv');
    assert.ok(csv.startsWith('name,version,type,purl,license,supplier'));
    assert.ok(csv.includes('lodash'));
    assert.ok(csv.includes('MIT'));
  });

  it('exports JSON array', () => {
    const json = exportComponentList(sbom, 'json');
    const parsed = JSON.parse(json);
    assert.equal(parsed.length, 2);
  });

  it('exports text format', () => {
    const text = exportComponentList(sbom, 'text');
    assert.ok(text.includes('lodash@4.17.21(library)'));
    assert.ok(text.includes('express@4.18.2(framework)'));
  });

  it('escapes CSV commas', () => {
    const s = { components: [{ name: 'a,b', version: '1' }] };
    const csv = exportComponentList(s, 'csv');
    assert.ok(csv.includes('"a,b"'));
  });

  it('handles empty components', () => {
    assert.equal(exportComponentList({ components: [] }, 'text'), '');
  });
});
