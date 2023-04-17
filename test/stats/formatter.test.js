const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatStats, statsToJson } = require('../../src/stats/formatter');

describe('stats formatter', () => {
  const stats = {
    format: 'cyclonedx',
    specVersion: '1.5',
    componentCount: 10,
    hasMetadata: true,
    hasTimestamp: true,
    hasTools: true,
    hasDependencies: true,
    types: {
      total: 10,
      types: [{ type: 'library', count: 8, pct: 80 }, { type: 'framework', count: 2, pct: 20 }],
      unknown: 0
    },
    scopes: { required: 8, optional: 2, excluded: 0, unspecified: 0, unknown: 0, total: 10, coverage: 100 },
    hashes: { total: 10, withHash: 7, withStrongHash: 5, withWeakOnly: 2, noHash: 3 },
    licenses: { copyleft: 1, permissive: 7, proprietary: 0, other: 0, unknown: 2 },
    externalRefs: { total: 10, withRefs: 4, withoutRefs: 6, totalRefs: 6, typeCounts: {}, coverage: 40 },
    coverage: { purl: 90, license: 80, hash: 70, supplier: 50, version: 100 }
  };

  it('renders text header', () => {
    const output = formatStats(stats);
    assert.ok(output.includes('SBOM Statistics'));
    assert.ok(output.includes('Components: 10'));
  });

  it('renders coverage bars', () => {
    const output = formatStats(stats);
    assert.ok(output.includes('purl'));
    assert.ok(output.includes('90%'));
    assert.ok(output.includes('['));
  });

  it('renders component types', () => {
    const output = formatStats(stats);
    assert.ok(output.includes('library: 8'));
    assert.ok(output.includes('framework: 2'));
  });

  it('renders license breakdown', () => {
    const output = formatStats(stats);
    assert.ok(output.includes('permissive: 7'));
    assert.ok(output.includes('copyleft: 1'));
  });

  it('produces valid JSON', () => {
    const json = statsToJson(stats);
    const parsed = JSON.parse(json);
    assert.equal(parsed.componentCount, 10);
  });
});
