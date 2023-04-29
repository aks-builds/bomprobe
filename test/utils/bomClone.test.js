const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { deepClone, cloneWithoutComponents, cloneWithSubset, cloneMetadataOnly } = require('../../src/utils/bomClone');

describe('bomClone utilities', () => {
  const sbom = {
    bomFormat: 'CycloneDX',
    specVersion: '1.4',
    metadata: { timestamp: '2023-04-29' },
    components: [
      { name: 'a', version: '1.0' },
      { name: 'b', version: '2.0' }
    ]
  };

  it('deep clones without reference sharing', () => {
    const clone = deepClone(sbom);
    clone.components[0].name = 'changed';
    assert.equal(sbom.components[0].name, 'a');
  });

  it('clones without components', () => {
    const clone = cloneWithoutComponents(sbom);
    assert.equal(clone.components, undefined);
    assert.equal(clone.bomFormat, 'CycloneDX');
  });

  it('clones with subset', () => {
    const clone = cloneWithSubset(sbom, ['a']);
    assert.equal(clone.components.length, 1);
    assert.equal(clone.components[0].name, 'a');
  });

  it('clones metadata only', () => {
    const clone = cloneMetadataOnly(sbom);
    assert.equal(clone.metadata.timestamp, '2023-04-29');
    assert.equal(clone.components, undefined);
  });
});
