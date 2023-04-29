const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { identifyGenerator, benchmarkSbom, formatBenchmark } = require('../../src/utils/generatorBenchmark');

describe('generator benchmark', () => {
  it('identifies Syft generator', () => {
    const sbom = { metadata: { tools: [{ name: 'syft', version: '0.90.0' }] } };
    const gen = identifyGenerator(sbom);
    assert.equal(gen.name, 'Syft');
    assert.equal(gen.vendor, 'Anchore');
  });

  it('identifies Trivy generator', () => {
    const sbom = { metadata: { tools: [{ name: 'trivy', version: '0.48.0' }] } };
    assert.equal(identifyGenerator(sbom).name, 'Trivy');
  });

  it('returns unknown for no tools', () => {
    const sbom = { metadata: {} };
    assert.equal(identifyGenerator(sbom).name, 'unknown');
  });

  it('benchmarks field coverage', () => {
    const sbom = {
      metadata: { tools: [{ name: 'syft' }] },
      components: [
        { name: 'foo', version: '1.0', purl: 'pkg:npm/foo@1.0', type: 'library' },
        { name: 'bar', type: 'library' }
      ]
    };
    const b = benchmarkSbom(sbom);
    assert.equal(b.total, 2);
    assert.equal(b.scores.name, 1);
    assert.equal(b.scores.version, 0.5);
    assert.equal(b.scores.purl, 0.5);
    assert.equal(b.scores.type, 1);
  });

  it('formats benchmark as text', () => {
    const b = {
      total: 10,
      generator: { name: 'Syft', vendor: 'Anchore', version: '0.90' },
      scores: { name: 1, version: 0.8, purl: 0.6, license: 0.3 }
    };
    const text = formatBenchmark(b);
    assert.ok(text.includes('Syft'));
    assert.ok(text.includes('100%'));
    assert.ok(text.includes('80%'));
  });

  it('handles empty components', () => {
    const b = benchmarkSbom({ components: [] });
    assert.equal(b.total, 0);
  });
});
