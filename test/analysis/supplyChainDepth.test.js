const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { analyzeSupplyChain, buildGraph, findRoots, measureDepth, formatSupplyChain } = require('../../src/analysis/supplyChainDepth');

describe('buildGraph', () => {
  it('builds adjacency map from dependencies', () => {
    const deps = [
      { ref: 'a', dependsOn: ['b', 'c'] },
      { ref: 'b', dependsOn: ['d'] }
    ];
    const g = buildGraph(deps);
    assert.deepEqual(g.get('a'), ['b', 'c']);
    assert.deepEqual(g.get('b'), ['d']);
  });

  it('handles empty dependencies', () => {
    assert.equal(buildGraph([]).size, 0);
    assert.equal(buildGraph(null).size, 0);
  });
});

describe('findRoots', () => {
  it('finds nodes that are not depended on', () => {
    const graph = new Map([['a', ['b']], ['b', ['c']], ['c', []]]);
    const components = [{ name: 'a' }, { name: 'b' }, { name: 'c' }];
    const roots = findRoots(graph, components);
    assert.ok(roots.includes('a'));
    assert.ok(!roots.includes('c'));
  });
});

describe('analyzeSupplyChain', () => {
  it('measures depth of a linear chain', () => {
    const sbom = {
      components: [{ name: 'a' }, { name: 'b' }, { name: 'c' }],
      dependencies: [
        { ref: 'a', dependsOn: ['b'] },
        { ref: 'b', dependsOn: ['c'] },
        { ref: 'c', dependsOn: [] }
      ]
    };
    const result = analyzeSupplyChain(sbom);
    assert.equal(result.maxDepth, 2);
    assert.equal(result.directCount, 1);
    assert.equal(result.transitiveCount, 1);
  });

  it('measures depth of a wide tree', () => {
    const sbom = {
      components: [{ name: 'root' }, { name: 'a' }, { name: 'b' }, { name: 'c' }],
      dependencies: [
        { ref: 'root', dependsOn: ['a', 'b', 'c'] },
        { ref: 'a', dependsOn: [] },
        { ref: 'b', dependsOn: [] },
        { ref: 'c', dependsOn: [] }
      ]
    };
    const result = analyzeSupplyChain(sbom);
    assert.equal(result.maxDepth, 1);
    assert.equal(result.directCount, 3);
  });

  it('handles circular dependencies', () => {
    const sbom = {
      components: [{ name: 'a' }, { name: 'b' }],
      dependencies: [
        { ref: 'a', dependsOn: ['b'] },
        { ref: 'b', dependsOn: ['a'] }
      ]
    };
    const result = analyzeSupplyChain(sbom);
    assert.ok(result.maxDepth >= 1);
  });

  it('handles empty SBOM', () => {
    const result = analyzeSupplyChain({ components: [], dependencies: [] });
    assert.equal(result.maxDepth, 0);
    assert.equal(result.totalNodes, 0);
  });

  it('warns on deep chains', () => {
    const deps = [];
    const components = [];
    for (let i = 0; i < 15; i++) {
      components.push({ name: `pkg-${i}` });
      deps.push({ ref: `pkg-${i}`, dependsOn: i < 14 ? [`pkg-${i + 1}`] : [] });
    }
    const result = analyzeSupplyChain({ components, dependencies: deps });
    assert.ok(result.maxDepth > 10);
    assert.ok(result.warnings.some(w => w.message.includes('exceeds')));
  });
});

describe('formatSupplyChain', () => {
  it('formats readable output', () => {
    const result = analyzeSupplyChain({
      components: [{ name: 'a' }, { name: 'b' }],
      dependencies: [{ ref: 'a', dependsOn: ['b'] }, { ref: 'b', dependsOn: [] }]
    });
    const out = formatSupplyChain(result);
    assert.ok(out.includes('Supply Chain'));
    assert.ok(out.includes('Max depth'));
  });
});
