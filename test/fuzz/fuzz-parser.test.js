const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { runAll } = require('../../src/checks');

function randomString(len) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789-_./@:';
  let s = '';
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function randomSbom() {
  const count = Math.floor(Math.random() * 50);
  const components = [];
  for (let i = 0; i < count; i++) {
    const c = { name: randomString(Math.floor(Math.random() * 40) + 1) };
    if (Math.random() > 0.3) c.version = `${Math.floor(Math.random() * 20)}.${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 100)}`;
    if (Math.random() > 0.5) c.type = ['library', 'framework', 'application', 'device'][Math.floor(Math.random() * 4)];
    if (Math.random() > 0.6) c.purl = `pkg:npm/${c.name}@${c.version || '0.0.0'}`;
    if (Math.random() > 0.7) c.hashes = [{ alg: 'SHA-256', content: randomString(64) }];
    if (Math.random() > 0.8) c.supplier = { name: randomString(10) };
    if (Math.random() > 0.5) c.licenses = [{ license: { id: 'MIT' } }];
    if (Math.random() > 0.9) c.description = randomString(200);
    components.push(c);
  }
  return {
    bomFormat: 'CycloneDX',
    specVersion: ['1.4', '1.5', '1.6'][Math.floor(Math.random() * 3)],
    metadata: {
      timestamp: new Date().toISOString(),
      tools: [{ name: 'fuzz-gen', version: '1.0.0' }]
    },
    components,
    dependencies: []
  };
}

describe('fuzz: checks+runAll never throw on random SBOMs', () => {
  for (let i = 0; i < 100; i++) {
    it(`random SBOM audit ${i}`, () => {
      const sbom = randomSbom();
      const results = runAll(sbom);
      assert.ok(Array.isArray(results));
      assert.ok(results.length > 0);
      for (const r of results) {
        assert.ok(typeof r.id === 'string');
        assert.ok(Array.isArray(r.findings));
      }
    });
  }

  it('audits empty SBOM', () => {
    const results = runAll({});
    assert.ok(Array.isArray(results));
  });

  it('audits SBOM with 1000 components', () => {
    const components = [];
    for (let i = 0; i < 1000; i++) components.push({ name: `pkg-${i}`, version: '1.0.0' });
    const results = runAll({ bomFormat: 'CycloneDX', components });
    assert.ok(Array.isArray(results));
    assert.ok(results.length > 0);
  });
});
