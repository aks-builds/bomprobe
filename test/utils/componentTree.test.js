const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { buildTree, findRoots, maxDepth, flatDependencies } = require('../../src/utils/componentTree');

const deps = [
  { ref: 'app', dependsOn: ['express', 'lodash'] },
  { ref: 'express', dependsOn: ['body-parser'] },
  { ref: 'body-parser', dependsOn: [] },
  { ref: 'lodash', dependsOn: [] }
];

describe('component tree', () => {
  it('builds tree from dependencies', () => {
    const tree = buildTree(deps);
    assert.deepEqual(tree.app, ['express', 'lodash']);
  });

  it('finds root nodes', () => {
    const tree = buildTree(deps);
    assert.deepEqual(findRoots(tree), ['app']);
  });

  it('calculates max depth', () => {
    const tree = buildTree(deps);
    assert.equal(maxDepth(tree), 2);
  });

  it('flattens all transitive dependencies', () => {
    const tree = buildTree(deps);
    const flat = flatDependencies(tree, 'app');
    assert.ok(flat.includes('express'));
    assert.ok(flat.includes('body-parser'));
    assert.ok(flat.includes('lodash'));
    assert.equal(flat.length, 3);
  });

  it('returns empty for leaf node', () => {
    const tree = buildTree(deps);
    assert.deepEqual(flatDependencies(tree, 'lodash'), []);
  });
});
