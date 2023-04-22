const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { buildAdjacencyList, detectCycles, topologicalSort } = require('../../src/utils/dependencyGraph');

describe('dependency graph utils', () => {
  describe('buildAdjacencyList', () => {
    it('builds graph from dependencies', () => {
      const deps = [
        { ref: 'a', dependsOn: ['b', 'c'] },
        { ref: 'b', dependsOn: ['c'] }
      ];
      const graph = buildAdjacencyList(deps);
      assert.deepEqual(graph.get('a'), ['b', 'c']);
      assert.deepEqual(graph.get('b'), ['c']);
    });

    it('handles empty input', () => {
      const graph = buildAdjacencyList([]);
      assert.equal(graph.size, 0);
    });
  });

  describe('detectCycles', () => {
    it('finds no cycles in acyclic graph', () => {
      const graph = new Map([['a', ['b']], ['b', ['c']], ['c', []]]);
      assert.equal(detectCycles(graph).length, 0);
    });

    it('detects cycle', () => {
      const graph = new Map([['a', ['b']], ['b', ['c']], ['c', ['a']]]);
      const cycles = detectCycles(graph);
      assert.ok(cycles.length > 0);
    });

    it('detects self-loop', () => {
      const graph = new Map([['a', ['a']]]);
      assert.ok(detectCycles(graph).length > 0);
    });
  });

  describe('topologicalSort', () => {
    it('sorts acyclic graph', () => {
      const graph = new Map([['a', ['b']], ['b', ['c']], ['c', []]]);
      const result = topologicalSort(graph);
      assert.equal(result.hasCycle, false);
      assert.ok(result.sorted.indexOf('a') < result.sorted.indexOf('b'));
      assert.ok(result.sorted.indexOf('b') < result.sorted.indexOf('c'));
    });

    it('detects cycle via incomplete sort', () => {
      const graph = new Map([['a', ['b']], ['b', ['a']]]);
      const result = topologicalSort(graph);
      assert.equal(result.hasCycle, true);
    });
  });
});
