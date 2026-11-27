function buildGraph(sbom) {
  const nodes = new Map();
  const edges = [];

  for (const c of sbom.components) {
    nodes.set(c.name, { name: c.name, version: c.version, purl: c.purl });
  }

  if (sbom.dependencies) {
    for (const dep of sbom.dependencies) {
      const from = dep.ref;
      for (const to of (dep.dependsOn || [])) {
        edges.push({ from, to });
      }
    }
  }

  return { nodes, edges };
}

function findRoots(graph) {
  const targets = new Set(graph.edges.map(e => e.to));
  const roots = [];
  for (const [name] of graph.nodes) {
    if (!targets.has(name)) roots.push(name);
  }
  return roots;
}

function findLeaves(graph) {
  const sources = new Set(graph.edges.map(e => e.from));
  const leaves = [];
  for (const [name] of graph.nodes) {
    if (!sources.has(name)) leaves.push(name);
  }
  return leaves;
}

function getDepth(graph) {
  const adj = new Map();
  for (const e of graph.edges) {
    if (!adj.has(e.from)) adj.set(e.from, []);
    adj.get(e.from).push(e.to);
  }

  let maxDepth = 0;
  const visited = new Set();

  function dfs(node, depth) {
    if (visited.has(node)) return;
    visited.add(node);
    maxDepth = Math.max(maxDepth, depth);
    for (const child of (adj.get(node) || [])) {
      dfs(child, depth + 1);
    }
    visited.delete(node);
  }

  for (const root of findRoots(graph)) {
    dfs(root, 0);
  }

  return maxDepth;
}

module.exports = { buildGraph, findRoots, findLeaves, getDepth };
