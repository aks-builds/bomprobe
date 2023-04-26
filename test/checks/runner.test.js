const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { runWithOptions, listChecks } = require('../../src/checks/runner');

describe('check runner', () => {
  const sbom = {
    bomFormat: 'CycloneDX',
    specVersion: '1.4',
    metadata: {
      timestamp: '2023-04-26T00:00:00Z',
      tools: [{ name: 'bomprobe', version: '1.0.0' }],
      authors: [{ name: 'test' }],
      component: { name: 'test-app', version: '1.0.0' }
    },
    components: [
      { name: 'lodash', version: '4.17.21', type: 'library', purl: 'pkg:npm/lodash@4.17.21' }
    ],
    dependencies: []
  };

  const subset = ['component-name', 'component-version', 'component-purl', 'spec-version'];

  it('returns checks and summary', () => {
    const result = runWithOptions(sbom, { only: subset });
    assert.ok(result.checks.length > 0);
    assert.ok(typeof result.summary.totalChecks === 'number');
    assert.ok(typeof result.summary.duration === 'number');
  });

  it('counts severity correctly', () => {
    const result = runWithOptions(sbom, { only: subset });
    const total = result.summary.errors + result.summary.warnings + result.summary.infos;
    assert.ok(total >= 0);
  });

  it('includes metadata', () => {
    const result = runWithOptions(sbom, { only: subset });
    assert.equal(result.metadata.sbomFormat, 'CycloneDX');
    assert.equal(result.metadata.componentCount, 1);
    assert.ok(result.metadata.timestamp);
  });

  it('respects only option count', () => {
    const result = runWithOptions(sbom, { only: subset });
    assert.equal(result.checks.length, subset.length);
  });

  it('lists all checks', () => {
    const checks = listChecks();
    assert.ok(checks.length >= 100);
  });

  it('filters by category prefix', () => {
    const checks = listChecks({ category: 'metadata-' });
    assert.ok(checks.every(c => c.id.startsWith('metadata-')));
  });
});
