const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { buildGraph, findRoots, findLeaves, findOrphans, findCycles, getTransitiveDeps, graphStats } = require('../../src/graph/dependencyGraph');

describe('buildGraph', () => {
  it('builds nodes from components', () => {
    const sbom = { components: [{ 'bom-ref': 'a', name: 'a', version: '1.0' }] };
    const g = buildGraph(sbom);
    assert.equal(g.nodes.size, 1);
  });

  it('builds edges from dependencies', () => {
    const sbom = {
      components: [{ 'bom-ref': 'a', name: 'a' }, { 'bom-ref': 'b', name: 'b' }],
      dependencies: [{ ref: 'a', dependsOn: ['b'] }]
    };
    const g = buildGraph(sbom);
    assert.equal(g.edges.length, 1);
  });

  it('handles empty sbom', () => {
    const g = buildGraph({});
    assert.equal(g.nodes.size, 0);
    assert.equal(g.edges.length, 0);
  });
});

describe('findRoots', () => {
  it('identifies root nodes', () => {
    const g = {
      nodes: new Map([['a', {}], ['b', {}], ['c', {}]]),
      edges: [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }]
    };
    assert.deepEqual(findRoots(g), ['a']);
  });
});

describe('findLeaves', () => {
  it('identifies leaf nodes', () => {
    const g = {
      nodes: new Map([['a', {}], ['b', {}], ['c', {}]]),
      edges: [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }]
    };
    assert.deepEqual(findLeaves(g), ['c']);
  });
});

describe('findOrphans', () => {
  it('identifies disconnected nodes', () => {
    const g = {
      nodes: new Map([['a', {}], ['b', {}], ['lonely', {}]]),
      edges: [{ from: 'a', to: 'b' }]
    };
    assert.deepEqual(findOrphans(g), ['lonely']);
  });
});

describe('findCycles', () => {
  it('detects circular dependencies', () => {
    const g = {
      nodes: new Map([['a', {}], ['b', {}]]),
      edges: [{ from: 'a', to: 'b' }, { from: 'b', to: 'a' }]
    };
    const cycles = findCycles(g);
    assert.ok(cycles.length > 0);
  });

  it('returns empty for acyclic graph', () => {
    const g = {
      nodes: new Map([['a', {}], ['b', {}], ['c', {}]]),
      edges: [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }]
    };
    assert.equal(findCycles(g).length, 0);
  });
});

describe('getTransitiveDeps', () => {
  it('finds all transitive dependencies', () => {
    const g = {
      nodes: new Map([['a', {}], ['b', {}], ['c', {}], ['d', {}]]),
      edges: [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }, { from: 'c', to: 'd' }]
    };
    const deps = getTransitiveDeps(g, 'a');
    assert.equal(deps.length, 3);
    assert.ok(deps.includes('b'));
    assert.ok(deps.includes('c'));
    assert.ok(deps.includes('d'));
  });
});

describe('graphStats', () => {
  it('computes graph statistics', () => {
    const sbom = {
      components: [
        { 'bom-ref': 'a', name: 'a' },
        { 'bom-ref': 'b', name: 'b' },
        { 'bom-ref': 'c', name: 'c' }
      ],
      dependencies: [{ ref: 'a', dependsOn: ['b', 'c'] }]
    };
    const g = buildGraph(sbom);
    const stats = graphStats(g);
    assert.equal(stats.nodes, 3);
    assert.equal(stats.edges, 2);
    assert.equal(stats.roots, 1);
    assert.equal(stats.leaves, 2);
  });
});
