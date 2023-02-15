const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { runAll } = require('../../src/checks');

const sbom = {
  format: 'cyclonedx',
  metadata: { author: null, timestamp: null, toolCount: 0, specVersion: '1.5' },
  components: [{ name: 'a', version: '1.0', supplier: null, license: null, purl: null, cpe: null, description: null, hashes: 0, type: null }],
  dependencyGraph: { totalEntries: 0, componentsWithDeps: 0, coverage: 0 }
};

describe('check exclusion', () => {
  it('runs all checks when no exclusions', () => {
    const results = runAll(sbom);
    assert.ok(results.length > 10);
  });

  it('excludes a single check by id', () => {
    const results = runAll(sbom, { exclude: ['component-name'] });
    const ids = results.map(r => r.id);
    assert.ok(!ids.includes('component-name'));
  });

  it('excludes multiple checks', () => {
    const results = runAll(sbom, { exclude: ['component-name', 'component-version', 'spec-version'] });
    const ids = results.map(r => r.id);
    assert.ok(!ids.includes('component-name'));
    assert.ok(!ids.includes('component-version'));
    assert.ok(!ids.includes('spec-version'));
  });

  it('ignores unknown exclusion ids', () => {
    const all = runAll(sbom);
    const filtered = runAll(sbom, { exclude: ['nonexistent-check'] });
    assert.equal(all.length, filtered.length);
  });
});
