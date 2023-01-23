const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { scoreSbom, scoreComponent, scoreMetadata } = require('../src/scorer');

describe('scoreComponent', () => {
  it('scores a perfect component at 10', () => {
    const c = {
      name: 'express',
      version: '4.18.2',
      supplier: 'expressjs',
      license: 'MIT',
      purl: 'pkg:npm/express@4.18.2',
      description: 'web framework',
      hashes: 2
    };
    assert.equal(scoreComponent(c), 10);
  });

  it('scores a minimal component lower', () => {
    const c = {
      name: 'unknown',
      version: null,
      supplier: null,
      license: null,
      purl: null,
      description: null,
      hashes: 0
    };
    const score = scoreComponent(c);
    assert.ok(score > 0);
    assert.ok(score < 5);
  });
});

describe('scoreMetadata', () => {
  it('scores complete metadata at 10', () => {
    const m = { author: 'acme', timestamp: '2023-01-01T00:00:00Z', toolCount: 1 };
    assert.equal(scoreMetadata(m), 10);
  });

  it('scores empty metadata at 0', () => {
    const m = { author: null, timestamp: null, toolCount: 0 };
    assert.equal(scoreMetadata(m), 0);
  });
});

describe('scoreSbom', () => {
  it('returns overall, component, metadata, and dependency scores', () => {
    const sbom = {
      metadata: { author: 'test', timestamp: '2023-01-01T00:00:00Z', toolCount: 1 },
      components: [
        { name: 'a', version: '1.0', supplier: 'x', license: 'MIT', purl: 'pkg:npm/a@1.0', description: 'lib', hashes: 1 }
      ],
      dependencyGraph: { totalEntries: 1, componentsWithDeps: 1, coverage: 1.0 }
    };
    const result = scoreSbom(sbom);
    assert.equal(result.overall, 10);
    assert.equal(result.components.average, 10);
    assert.equal(result.metadata, 10);
    assert.equal(result.dependencyCoverage, 10);
  });

  it('handles empty SBOM', () => {
    const sbom = {
      metadata: { author: null, timestamp: null, toolCount: 0 },
      components: [],
      dependencyGraph: { totalEntries: 0, componentsWithDeps: 0, coverage: 0 }
    };
    const result = scoreSbom(sbom);
    assert.equal(result.overall, 0);
    assert.equal(result.components.count, 0);
  });
});
