const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { componentStats } = require('../../src/utils/stats');

describe('component stats', () => {
  it('counts field coverage', () => {
    const sbom = {
      components: [
        { name: 'a', license: 'MIT', purl: 'pkg:npm/a@1', hashes: 1, supplier: 'x' },
        { name: 'b', license: null, purl: null, hashes: 0, supplier: null }
      ]
    };
    const stats = componentStats(sbom);
    assert.equal(stats.total, 2);
    assert.equal(stats.withLicense, 1);
    assert.equal(stats.withPurl, 1);
    assert.equal(stats.withHashes, 1);
    assert.equal(stats.withSupplier, 1);
    assert.equal(stats.licenseCoverage, 0.5);
  });

  it('handles empty components', () => {
    const stats = componentStats({ components: [] });
    assert.equal(stats.total, 0);
    assert.equal(stats.withLicense, 0);
  });

  it('reports full coverage', () => {
    const sbom = {
      components: [
        { name: 'a', license: 'MIT', purl: 'pkg:npm/a@1', hashes: 2, supplier: 'x' }
      ]
    };
    const stats = componentStats(sbom);
    assert.equal(stats.licenseCoverage, 1);
    assert.equal(stats.purlCoverage, 1);
  });
});
