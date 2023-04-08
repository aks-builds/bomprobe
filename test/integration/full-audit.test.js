const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { runAll, getChecks } = require('../../src/checks');

describe('full audit integration', () => {
  const minimalSbom = {
    bomFormat: 'CycloneDX',
    specVersion: '1.4',
    metadata: {
      timestamp: new Date().toISOString(),
      tools: [{ name: 'bomprobe', version: '1.0.0' }],
      component: { name: 'test-app', version: '1.0.0', type: 'application' }
    },
    components: [
      {
        name: 'lodash',
        version: '4.17.21',
        type: 'library',
        purl: 'pkg:npm/lodash@4.17.21',
        'bom-ref': 'lodash-4.17.21',
        hashes: [{ alg: 'SHA-256', content: 'abc123' }],
        licenses: [{ license: { id: 'MIT' } }]
      }
    ],
    dependencies: [
      { ref: 'lodash-4.17.21', dependsOn: [] }
    ],
    dependencyGraph: {
      totalEntries: 1,
      componentsWithDeps: 1,
      coverage: 1
    }
  };

  it('runs all registered checks', () => {
    const results = runAll(minimalSbom);
    assert.ok(results.length > 40);
  });

  it('every check returns an array', () => {
    const results = runAll(minimalSbom);
    for (const r of results) {
      assert.ok(Array.isArray(r.findings), `${r.id} findings should be array`);
    }
  });

  it('supports exclude option', () => {
    const all = runAll(minimalSbom);
    const filtered = runAll(minimalSbom, { exclude: ['component-name'] });
    assert.equal(filtered.length, all.length - 1);
  });

  it('supports only option', () => {
    const results = runAll(minimalSbom, { only: ['component-name', 'component-version'] });
    assert.equal(results.length, 2);
  });

  it('getChecks returns check metadata', () => {
    const checks = getChecks();
    assert.ok(checks.length > 40);
    for (const c of checks) {
      assert.ok(c.id);
      assert.ok(c.name);
      assert.ok(typeof c.weight === 'number');
    }
  });
});
