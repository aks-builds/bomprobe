const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { runAll } = require('../../src/checks');

function randomValue() {
  const r = Math.random();
  if (r < 0.15) return null;
  if (r < 0.3) return undefined;
  if (r < 0.4) return Math.floor(Math.random() * 1000);
  if (r < 0.5) return Math.random() > 0.5;
  if (r < 0.6) return [];
  if (r < 0.7) return {};
  if (r < 0.8) return '';
  return 'x'.repeat(Math.floor(Math.random() * 100));
}

function fuzzComponent() {
  const fields = ['name', 'version', 'type', 'purl', 'supplier', 'hashes',
    'licenses', 'description', 'copyright', 'cpe', 'scope', 'group',
    'externalReferences', 'properties', 'evidence', 'modified', 'author',
    'swid', 'bom-ref', 'mime-type'];
  const c = {};
  for (const f of fields) {
    if (Math.random() > 0.5) c[f] = randomValue();
  }
  if (Math.random() > 0.7 && typeof c.name !== 'string') c.name = 'fuzz-pkg';
  return c;
}

function fuzzSbom() {
  const count = Math.floor(Math.random() * 30);
  const components = [];
  for (let i = 0; i < count; i++) components.push(fuzzComponent());
  return {
    bomFormat: Math.random() > 0.2 ? 'CycloneDX' : randomValue(),
    specVersion: Math.random() > 0.3 ? '1.5' : randomValue(),
    metadata: Math.random() > 0.3 ? {
      timestamp: Math.random() > 0.5 ? new Date().toISOString() : randomValue(),
      tools: Math.random() > 0.5 ? [{ name: 'fuzz' }] : randomValue()
    } : randomValue(),
    components: Math.random() > 0.1 ? components : randomValue(),
    dependencies: Math.random() > 0.5 ? [] : randomValue()
  };
}

describe('fuzz: all checks survive random SBOMs', () => {
  for (let i = 0; i < 200; i++) {
    it(`fuzz iteration ${i}`, () => {
      const sbom = fuzzSbom();
      assert.doesNotThrow(() => runAll(sbom));
    });
  }

  it('survives entirely empty SBOM', () => {
    assert.doesNotThrow(() => runAll({}));
  });

  it('survives SBOM with components = 0', () => {
    assert.doesNotThrow(() => runAll({ components: 0 }));
  });

  it('survives SBOM with components = string', () => {
    assert.doesNotThrow(() => runAll({ components: 'invalid' }));
  });

  it('survives SBOM with circular-like structure', () => {
    const c = { name: 'circ', dependencies: [] };
    c.dependencies.push({ ref: 'circ' });
    assert.doesNotThrow(() => runAll({ components: [c], dependencies: [{ ref: 'circ', dependsOn: ['circ'] }] }));
  });
});
