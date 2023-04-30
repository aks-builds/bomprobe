const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { compareSboms, diffComponents, diffFields } = require('../../src/diff/comparator');

describe('compareSboms', () => {
  it('detects added components', () => {
    const before = { components: [{ name: 'a', version: '1.0' }], metadata: {} };
    const after = { components: [{ name: 'a', version: '1.0' }, { name: 'b', version: '2.0' }], metadata: {} };
    const diff = compareSboms(before, after);
    assert.equal(diff.summary.added, 1);
    assert.equal(diff.summary.removed, 0);
    assert.equal(diff.components.added[0].name, 'b');
  });

  it('detects removed components', () => {
    const before = { components: [{ name: 'a', version: '1.0' }, { name: 'b', version: '2.0' }], metadata: {} };
    const after = { components: [{ name: 'a', version: '1.0' }], metadata: {} };
    const diff = compareSboms(before, after);
    assert.equal(diff.summary.removed, 1);
    assert.equal(diff.components.removed[0].name, 'b');
  });

  it('detects modified components', () => {
    const before = { components: [{ name: 'a', version: '1.0', type: 'library' }], metadata: {} };
    const after = { components: [{ name: 'a', version: '1.0', type: 'framework' }], metadata: {} };
    const diff = compareSboms(before, after);
    assert.equal(diff.summary.modified, 1);
    assert.equal(diff.components.modified[0].changes[0].field, 'type');
  });

  it('reports unchanged components', () => {
    const before = { components: [{ name: 'a', version: '1.0' }], metadata: {} };
    const after = { components: [{ name: 'a', version: '1.0' }], metadata: {} };
    const diff = compareSboms(before, after);
    assert.equal(diff.summary.unchanged, 1);
    assert.equal(diff.summary.added, 0);
  });

  it('detects version upgrades as added+removed', () => {
    const before = { components: [{ name: 'pkg', version: '1.0.0' }], metadata: {} };
    const after = { components: [{ name: 'pkg', version: '2.0.0' }], metadata: {} };
    const diff = compareSboms(before, after);
    assert.equal(diff.summary.added, 1);
    assert.equal(diff.summary.removed, 1);
  });

  it('detects metadata timestamp changes', () => {
    const before = { components: [], metadata: { timestamp: '2023-01-01' } };
    const after = { components: [], metadata: { timestamp: '2023-06-01' } };
    const diff = compareSboms(before, after);
    assert.ok(diff.metadata.some(c => c.field === 'timestamp'));
  });

  it('handles empty SBOMs', () => {
    const diff = compareSboms({ components: [], metadata: {} }, { components: [], metadata: {} });
    assert.equal(diff.summary.beforeCount, 0);
    assert.equal(diff.summary.afterCount, 0);
  });
});

describe('diffFields', () => {
  it('detects license changes', () => {
    const a = { licenses: [{ license: { id: 'MIT' } }] };
    const b = { licenses: [{ license: { id: 'Apache-2.0' } }] };
    const changes = diffFields(a, b);
    assert.ok(changes.some(c => c.field === 'licenses'));
  });

  it('detects hash changes', () => {
    const a = { hashes: [{ alg: 'SHA-256', content: 'abc' }] };
    const b = { hashes: [{ alg: 'SHA-256', content: 'def' }] };
    const changes = diffFields(a, b);
    assert.ok(changes.some(c => c.field === 'hashes'));
  });

  it('returns empty for identical components', () => {
    const c = { type: 'library', purl: 'pkg:npm/x@1.0' };
    assert.equal(diffFields(c, { ...c }).length, 0);
  });
});
