const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { createSnapshot, compareSnapshots } = require('../../src/utils/bomSnapshot');

describe('bomSnapshot', () => {
  it('creates snapshot with component metadata', () => {
    const sbom = {
      bomFormat: 'CycloneDX',
      specVersion: '1.4',
      components: [
        { name: 'a', version: '1.0', purl: 'pkg:npm/a@1', licenses: [{ license: { id: 'MIT' } }] }
      ]
    };
    const snap = createSnapshot(sbom);
    assert.equal(snap.format, 'CycloneDX');
    assert.equal(snap.componentCount, 1);
    assert.ok(snap.components[0].hasLicense);
  });

  it('handles empty SBOM', () => {
    const snap = createSnapshot({ components: [] });
    assert.equal(snap.componentCount, 0);
  });

  it('compares snapshots for added/removed', () => {
    const before = { componentCount: 2, components: [{ name: 'a' }, { name: 'b' }] };
    const after = { componentCount: 2, components: [{ name: 'b' }, { name: 'c' }] };
    const diff = compareSnapshots(before, after);
    assert.equal(diff.added, 1);
    assert.equal(diff.removed, 1);
    assert.equal(diff.unchanged, 1);
  });

  it('detects all new components', () => {
    const before = { componentCount: 0, components: [] };
    const after = { componentCount: 2, components: [{ name: 'a' }, { name: 'b' }] };
    const diff = compareSnapshots(before, after);
    assert.equal(diff.added, 2);
    assert.equal(diff.removed, 0);
  });
});
