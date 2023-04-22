const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { computeMetrics } = require('../../src/utils/bomMetrics');

describe('bom metrics', () => {
  it('computes coverage percentages', () => {
    const sbom = {
      components: [
        { name: 'a', version: '1.0', purl: 'pkg:npm/a@1.0', hashes: [{ alg: 'SHA-256', content: 'abc' }], supplier: { name: 'Acme' }, licenses: [{ license: { id: 'MIT' } }], description: 'lib a' },
        { name: 'b', version: '2.0' }
      ],
      dependencies: [{ ref: 'a', dependsOn: ['b'] }],
      metadata: { tools: [{ name: 'syft' }] }
    };
    const m = computeMetrics(sbom);
    assert.equal(m.componentCount, 2);
    assert.equal(m.coverage.purl, 50);
    assert.equal(m.coverage.version, 100);
    assert.equal(m.coverage.license, 50);
    assert.equal(m.coverage.hash, 50);
    assert.equal(m.hasMetadata, true);
    assert.equal(m.hasTools, true);
    assert.equal(m.hasDependencies, true);
  });

  it('handles empty SBOM', () => {
    const m = computeMetrics({ components: [] });
    assert.equal(m.componentCount, 0);
    assert.equal(m.completenessScore, 0);
  });

  it('handles no components key', () => {
    const m = computeMetrics({});
    assert.equal(m.componentCount, 0);
  });

  it('calculates completeness score from 5 fields', () => {
    const sbom = {
      components: [
        { name: 'a', version: '1.0', purl: 'p', hashes: [{}], supplier: { name: 'x' }, licenses: [{}] }
      ]
    };
    const m = computeMetrics(sbom);
    assert.equal(m.completenessScore, 100);
  });

  it('detects spec version', () => {
    const m = computeMetrics({ specVersion: '1.5', components: [{ name: 'a' }] });
    assert.equal(m.specVersion, '1.5');
  });

  it('falls back to spdxVersion', () => {
    const m = computeMetrics({ spdxVersion: 'SPDX-2.3', components: [{ name: 'a' }] });
    assert.equal(m.specVersion, 'SPDX-2.3');
  });
});
