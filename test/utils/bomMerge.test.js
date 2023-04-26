const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { mergeSboms } = require('../../src/utils/bomMerge');

describe('bomMerge', () => {
  it('merges unique components', () => {
    const a = { components: [{ name: 'x', purl: 'pkg:npm/x@1' }], dependencies: [] };
    const b = { components: [{ name: 'y', purl: 'pkg:npm/y@1' }], dependencies: [] };
    const { merged, added } = mergeSboms(a, b);
    assert.equal(merged.components.length, 2);
    assert.equal(added, 1);
  });

  it('skips duplicates by purl', () => {
    const a = { components: [{ name: 'x', purl: 'pkg:npm/x@1' }], dependencies: [] };
    const b = { components: [{ name: 'x', purl: 'pkg:npm/x@1' }], dependencies: [] };
    const { merged, duplicatesSkipped } = mergeSboms(a, b);
    assert.equal(merged.components.length, 1);
    assert.equal(duplicatesSkipped, 1);
  });

  it('skips duplicates by bom-ref', () => {
    const a = { components: [{ name: 'x', 'bom-ref': 'ref-1' }], dependencies: [] };
    const b = { components: [{ name: 'x', 'bom-ref': 'ref-1' }], dependencies: [] };
    assert.equal(mergeSboms(a, b).merged.components.length, 1);
  });

  it('merges dependencies without duplicates', () => {
    const a = { components: [], dependencies: [{ ref: 'a', dependsOn: ['b'] }] };
    const b = { components: [], dependencies: [{ ref: 'a', dependsOn: ['c'] }, { ref: 'd', dependsOn: [] }] };
    assert.equal(mergeSboms(a, b).merged.dependencies.length, 2);
  });

  it('preserves primary sbom fields', () => {
    const a = { bomFormat: 'CycloneDX', specVersion: '1.4', components: [], dependencies: [] };
    const b = { bomFormat: 'CycloneDX', specVersion: '1.5', components: [], dependencies: [] };
    assert.equal(mergeSboms(a, b).merged.specVersion, '1.4');
  });

  it('handles missing dependencies arrays', () => {
    const a = { components: [{ name: 'a' }] };
    const b = { components: [{ name: 'b' }] };
    const { merged } = mergeSboms(a, b);
    assert.equal(merged.components.length, 2);
  });
});
