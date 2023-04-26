const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { collectStats, formatStatsText } = require('../../src/utils/bomStats');

describe('bomStats', () => {
  const sbom = {
    components: [
      { name: 'a', type: 'library', version: '1.0', purl: 'pkg:npm/a@1', licenses: [{}], hashes: [{}], supplier: { name: 'x' } },
      { name: 'b', type: 'library', version: '2.0', purl: 'pkg:npm/b@2' },
      { name: 'c', type: 'framework' }
    ]
  };

  it('counts total components', () => {
    assert.equal(collectStats(sbom).totalComponents, 3);
  });

  it('groups by type', () => {
    const stats = collectStats(sbom);
    assert.equal(stats.byType.library, 2);
    assert.equal(stats.byType.framework, 1);
  });

  it('counts field coverage', () => {
    const stats = collectStats(sbom);
    assert.equal(stats.withLicense, 1);
    assert.equal(stats.withPurl, 2);
    assert.equal(stats.withVersion, 2);
    assert.equal(stats.withSupplier, 1);
  });

  it('computes average properties', () => {
    const stats = collectStats(sbom);
    assert.ok(stats.avgPropsPerComponent > 0);
  });

  it('handles empty components', () => {
    assert.equal(collectStats({ components: [] }).totalComponents, 0);
  });

  it('formats text output', () => {
    const text = formatStatsText(collectStats(sbom));
    assert.ok(text.includes('Components: 3'));
    assert.ok(text.includes('library: 2'));
  });
});
