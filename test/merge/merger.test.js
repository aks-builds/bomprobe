const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { mergeSboms, mergeComponent, componentKey } = require('../../src/merge/merger');

describe('componentKey', () => {
  it('uses purl when available', () => {
    assert.equal(componentKey({ name: 'x', purl: 'pkg:npm/x@1.0' }), 'pkg:npm/x@1.0');
  });

  it('falls back to name@version@type', () => {
    assert.equal(componentKey({ name: 'x', version: '1.0', type: 'library' }), 'x@1.0@library');
  });
});

describe('mergeSboms', () => {
  it('returns empty SBOM for empty input', () => {
    const result = mergeSboms([]);
    assert.equal(result.components.length, 0);
  });

  it('returns single SBOM unchanged', () => {
    const sbom = { bomFormat: 'CycloneDX', components: [{ name: 'a' }] };
    assert.deepEqual(mergeSboms([sbom]), sbom);
  });

  it('union merges unique components', () => {
    const a = { components: [{ name: 'x', version: '1.0' }], metadata: {} };
    const b = { components: [{ name: 'y', version: '2.0' }], metadata: {} };
    const result = mergeSboms([a, b]);
    assert.equal(result.components.length, 2);
  });

  it('union deduplicates by purl', () => {
    const a = { components: [{ name: 'x', version: '1.0', purl: 'pkg:npm/x@1.0' }], metadata: {} };
    const b = { components: [{ name: 'x', version: '1.0', purl: 'pkg:npm/x@1.0', description: 'lib x' }], metadata: {} };
    const result = mergeSboms([a, b]);
    assert.equal(result.components.length, 1);
    assert.equal(result.components[0].description, 'lib x');
  });

  it('intersect keeps only shared components', () => {
    const a = { components: [{ name: 'x', version: '1.0' }, { name: 'y', version: '2.0' }], metadata: {} };
    const b = { components: [{ name: 'x', version: '1.0' }], metadata: {} };
    const result = mergeSboms([a, b], { strategy: 'intersect' });
    assert.equal(result.components.length, 1);
    assert.equal(result.components[0].name, 'x');
  });

  it('merges dependencies', () => {
    const a = { components: [], metadata: {}, dependencies: [{ ref: 'a', dependsOn: ['b'] }] };
    const b = { components: [], metadata: {}, dependencies: [{ ref: 'a', dependsOn: ['c'] }] };
    const result = mergeSboms([a, b]);
    const dep = result.dependencies.find(d => d.ref === 'a');
    assert.ok(dep.dependsOn.includes('b'));
    assert.ok(dep.dependsOn.includes('c'));
  });

  it('uses highest spec version', () => {
    const a = { specVersion: '1.4', components: [], metadata: {} };
    const b = { specVersion: '1.6', components: [], metadata: {} };
    const result = mergeSboms([a, b]);
    assert.equal(result.specVersion, '1.6');
  });

  it('collects tools from all SBOMs', () => {
    const a = { components: [], metadata: { tools: [{ name: 'syft', version: '1.0' }] } };
    const b = { components: [], metadata: { tools: [{ name: 'trivy', version: '0.50' }] } };
    const result = mergeSboms([a, b]);
    assert.ok(result.metadata.tools.some(t => t.name === 'syft'));
    assert.ok(result.metadata.tools.some(t => t.name === 'trivy'));
  });
});

describe('mergeComponent', () => {
  it('fills missing fields from second component', () => {
    const a = { name: 'x', version: '1.0' };
    const b = { name: 'x', version: '1.0', supplier: { name: 'ACME' }, description: 'a lib' };
    const result = mergeComponent(a, b);
    assert.equal(result.supplier.name, 'ACME');
    assert.equal(result.description, 'a lib');
  });

  it('merges hashes without duplicates', () => {
    const a = { hashes: [{ alg: 'SHA-256', content: 'abc' }] };
    const b = { hashes: [{ alg: 'SHA-256', content: 'abc' }, { alg: 'SHA-512', content: 'def' }] };
    const result = mergeComponent(a, b);
    assert.equal(result.hashes.length, 2);
  });
});
