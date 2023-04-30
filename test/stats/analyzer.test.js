const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { analyzeStats, formatStats, extractLicenses } = require('../../src/stats/analyzer');

describe('analyzeStats', () => {
  it('counts component types', () => {
    const sbom = { components: [
      { name: 'a', type: 'library' },
      { name: 'b', type: 'library' },
      { name: 'c', type: 'framework' }
    ], metadata: {} };
    const stats = analyzeStats(sbom);
    assert.equal(stats.types.library, 2);
    assert.equal(stats.types.framework, 1);
  });

  it('calculates field coverage', () => {
    const sbom = { components: [
      { name: 'a', version: '1.0', purl: 'pkg:npm/a@1.0', hashes: [{ alg: 'SHA-256', content: 'x' }] },
      { name: 'b' }
    ], metadata: {} };
    const stats = analyzeStats(sbom);
    assert.equal(stats.coverage.purl, 50);
    assert.equal(stats.coverage.hash, 50);
    assert.equal(stats.coverage.version, 50);
  });

  it('counts licenses', () => {
    const sbom = { components: [
      { name: 'a', licenses: [{ license: { id: 'MIT' } }] },
      { name: 'b', licenses: [{ license: { id: 'MIT' } }] },
      { name: 'c', licenses: [{ license: { id: 'Apache-2.0' } }] }
    ], metadata: {} };
    const stats = analyzeStats(sbom);
    assert.equal(stats.licenses['MIT'], 2);
    assert.equal(stats.licenses['Apache-2.0'], 1);
  });

  it('handles empty SBOM', () => {
    const stats = analyzeStats({ components: [], metadata: {} });
    assert.equal(stats.total, 0);
    assert.equal(stats.coverage.purl, 0);
  });

  it('reports metadata info', () => {
    const sbom = {
      bomFormat: 'CycloneDX', specVersion: '1.5',
      metadata: { timestamp: '2023-01-01', tools: [{ name: 'syft' }] },
      components: []
    };
    const stats = analyzeStats(sbom);
    assert.equal(stats.metadata.hasTimestamp, true);
    assert.equal(stats.metadata.hasTools, true);
    assert.equal(stats.metadata.specVersion, '1.5');
  });
});

describe('extractLicenses', () => {
  it('extracts from license id', () => {
    assert.deepEqual(extractLicenses({ licenses: [{ license: { id: 'MIT' } }] }), ['MIT']);
  });

  it('extracts from expression', () => {
    assert.deepEqual(extractLicenses({ licenses: [{ expression: 'MIT OR Apache-2.0' }] }), ['MIT OR Apache-2.0']);
  });

  it('returns empty for no licenses', () => {
    assert.deepEqual(extractLicenses({}), []);
  });
});

describe('formatStats', () => {
  it('formats readable output', () => {
    const stats = analyzeStats({
      bomFormat: 'CycloneDX', specVersion: '1.5',
      components: [{ name: 'a', version: '1.0', type: 'library' }],
      metadata: { timestamp: '2023-01-01' }
    });
    const out = formatStats(stats);
    assert.ok(out.includes('Total components: 1'));
    assert.ok(out.includes('CycloneDX'));
  });
});
