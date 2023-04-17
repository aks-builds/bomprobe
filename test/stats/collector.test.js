const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { collectStats } = require('../../src/stats/collector');

describe('stats collector', () => {
  const sbom = {
    bomFormat: 'CycloneDX',
    specVersion: '1.5',
    metadata: {
      timestamp: '2023-04-17T10:00:00Z',
      tools: [{ name: 'cdxgen' }]
    },
    components: [
      {
        name: 'express',
        version: '4.18.2',
        type: 'library',
        purl: 'pkg:npm/express@4.18.2',
        hashes: [{ alg: 'SHA-256', content: 'abc' }],
        licenses: [{ license: { id: 'MIT' } }],
        supplier: { name: 'Express.js' },
        scope: 'required'
      },
      {
        name: 'lodash',
        version: '4.17.21',
        type: 'library',
        purl: 'pkg:npm/lodash@4.17.21'
      }
    ],
    dependencies: [{ ref: 'express', dependsOn: [] }]
  };

  it('collects basic metadata stats', () => {
    const stats = collectStats(sbom);
    assert.equal(stats.componentCount, 2);
    assert.equal(stats.hasMetadata, true);
    assert.equal(stats.hasTimestamp, true);
    assert.equal(stats.hasTools, true);
    assert.equal(stats.hasDependencies, true);
  });

  it('calculates coverage percentages', () => {
    const stats = collectStats(sbom);
    assert.equal(stats.coverage.purl, 100);
    assert.equal(stats.coverage.version, 100);
    assert.equal(stats.coverage.hash, 50);
    assert.equal(stats.coverage.supplier, 50);
    assert.equal(stats.coverage.license, 50);
  });

  it('collects type summary', () => {
    const stats = collectStats(sbom);
    assert.equal(stats.types.total, 2);
    assert.equal(stats.types.types[0].type, 'library');
  });

  it('collects scope analysis', () => {
    const stats = collectStats(sbom);
    assert.equal(stats.scopes.required, 1);
    assert.equal(stats.scopes.unspecified, 1);
  });

  it('collects hash analysis', () => {
    const stats = collectStats(sbom);
    assert.equal(stats.hashes.withStrongHash, 1);
    assert.equal(stats.hashes.noHash, 1);
  });

  it('collects license classification', () => {
    const stats = collectStats(sbom);
    assert.equal(stats.licenses.permissive, 1);
    assert.equal(stats.licenses.unknown, 1);
  });

  it('handles empty SBOM', () => {
    const stats = collectStats({ metadata: {}, components: [] });
    assert.equal(stats.componentCount, 0);
    assert.equal(stats.coverage.purl, 0);
  });
});
