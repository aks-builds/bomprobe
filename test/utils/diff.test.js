const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { diffComponents, diffScores } = require('../../src/utils/diff');

describe('diff utilities', () => {
  it('detects added components', () => {
    const before = [{ name: 'a', version: '1.0' }];
    const after = [{ name: 'a', version: '1.0' }, { name: 'b', version: '2.0' }];
    const diff = diffComponents(before, after);
    assert.equal(diff.added.length, 1);
    assert.equal(diff.added[0].name, 'b');
  });

  it('detects removed components', () => {
    const before = [{ name: 'a', version: '1.0' }, { name: 'b', version: '2.0' }];
    const after = [{ name: 'a', version: '1.0' }];
    const diff = diffComponents(before, after);
    assert.equal(diff.removed.length, 1);
    assert.equal(diff.removed[0].name, 'b');
  });

  it('detects version changes', () => {
    const before = [{ name: 'a', version: '1.0' }];
    const after = [{ name: 'a', version: '2.0' }];
    const diff = diffComponents(before, after);
    assert.equal(diff.changed.length, 1);
    assert.equal(diff.changed[0].from, '1.0');
    assert.equal(diff.changed[0].to, '2.0');
  });

  it('reports no changes for identical lists', () => {
    const list = [{ name: 'a', version: '1.0' }];
    const diff = diffComponents(list, list);
    assert.equal(diff.added.length, 0);
    assert.equal(diff.removed.length, 0);
    assert.equal(diff.changed.length, 0);
  });

  it('computes score deltas', () => {
    const before = { overall: 5, components: { average: 6 }, metadata: 4, dependencyCoverage: 3 };
    const after = { overall: 7, components: { average: 8 }, metadata: 6, dependencyCoverage: 5 };
    const delta = diffScores(before, after);
    assert.equal(delta.overall, 2);
    assert.equal(delta.components, 2);
    assert.equal(delta.metadata, 2);
    assert.equal(delta.dependencies, 2);
  });

  it('handles negative deltas', () => {
    const before = { overall: 8, components: { average: 9 }, metadata: 7, dependencyCoverage: 6 };
    const after = { overall: 5, components: { average: 4 }, metadata: 3, dependencyCoverage: 2 };
    const delta = diffScores(before, after);
    assert.equal(delta.overall, -3);
  });
});
