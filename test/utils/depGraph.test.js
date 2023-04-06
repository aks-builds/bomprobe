const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { buildGraph, findRoots, findLeaves, getDepth } = require('../../src/utils/depGraph');

describe('dependency graph', () => {
  const sbom = {
    components: [
      { name: 'app', version: '1.0', purl: null },
      { name: 'lib-a', version: '2.0', purl: null },
      { name: 'lib-b', version: '3.0', purl: null },
      { name: 'lib-c', version: '1.0', purl: null }
    ],
    dependencies: [
      { ref: 'app', dependsOn: ['lib-a', 'lib-b'] },
      { ref: 'lib-a', dependsOn: ['lib-c'] }
    ]
  };

  it('builds a graph from SBOM', () => {
    const graph = buildGraph(sbom);
    assert.equal(graph.nodes.size, 4);
    assert.equal(graph.edges.length, 3);
  });

  it('finds root nodes', () => {
    const graph = buildGraph(sbom);
    const roots = findRoots(graph);
    assert.deepEqual(roots, ['app']);
  });

  it('finds leaf nodes', () => {
    const graph = buildGraph(sbom);
    const leaves = findLeaves(graph);
    assert.ok(leaves.includes('lib-b'));
    assert.ok(leaves.includes('lib-c'));
  });

  it('calculates max depth', () => {
    const graph = buildGraph(sbom);
    const depth = getDepth(graph);
    assert.equal(depth, 2);
  });

  it('handles empty dependencies', () => {
    const empty = { components: [{ name: 'a' }] };
    const graph = buildGraph(empty);
    assert.equal(graph.edges.length, 0);
    assert.equal(findRoots(graph).length, 1);
  });
});
