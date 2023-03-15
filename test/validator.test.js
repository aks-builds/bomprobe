const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { validate } = require('../src/validator');

describe('validator', () => {
  it('passes a well-formed SBOM', () => {
    const sbom = {
      format: 'cyclonedx',
      metadata: { author: 'test' },
      components: [{ name: 'a' }],
      dependencyGraph: { totalEntries: 0, componentsWithDeps: 0, coverage: 0 }
    };
    const result = validate(sbom);
    assert.ok(result.valid);
    assert.equal(result.errors.length, 0);
  });

  it('reports missing format', () => {
    const sbom = { metadata: {}, components: [], dependencyGraph: {} };
    const result = validate(sbom);
    assert.ok(!result.valid);
    assert.ok(result.errors.some(e => e.includes('format')));
  });

  it('reports missing metadata', () => {
    const sbom = { format: 'x', components: [], dependencyGraph: {} };
    const result = validate(sbom);
    assert.ok(!result.valid);
  });

  it('reports non-array components', () => {
    const sbom = { format: 'x', metadata: {}, components: 'nope', dependencyGraph: {} };
    const result = validate(sbom);
    assert.ok(!result.valid);
    assert.ok(result.errors.some(e => e.includes('array')));
  });

  it('reports components with no name or purl', () => {
    const sbom = {
      format: 'x',
      metadata: {},
      components: [{ version: '1.0' }],
      dependencyGraph: {}
    };
    const result = validate(sbom);
    assert.ok(!result.valid);
    assert.ok(result.errors.some(e => e.includes('index 0')));
  });

  it('reports missing dependency graph', () => {
    const sbom = { format: 'x', metadata: {}, components: [] };
    const result = validate(sbom);
    assert.ok(!result.valid);
  });
});
