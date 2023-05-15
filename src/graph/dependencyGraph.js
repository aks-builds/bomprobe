function buildGraph(sbom) {
  const nodes = new Map();
  const edges = [];

  const components = Array.isArray(sbom?.components) ? sbom.components : [];
  for (const comp of components) {
    if (!comp) continue;
    const id = comp['bom-ref'] || comp.purl || `${comp.name}@${comp.version}`;
    nodes.set(id, {
      id,
      name: comp.name || 'unknown',
      version: comp.version || '',
      type: comp.type || 'library',
      purl: comp.purl || null,
      scope: comp.scope || 'required'
    });
  }

  const deps = Array.isArray(sbom?.dependencies) ? sbom.dependencies : [];
  for (const dep of deps) {
    if (!dep || !dep.ref) continue;
    const dependsOn = Array.isArray(dep.dependsOn) ? dep.dependsOn : [];
    for (const target of dependsOn) {
      edges.push({ from: dep.ref, to: target });
    }
  }

  return { nodes, edges };
}

function findRoots(graph) {
  const hasIncoming = new Set();
  for (const edge of graph.edges) {
    hasIncoming.add(edge.to);
  }
  const roots = [];
  for (const [id] of graph.nodes) {
    if (!hasIncoming.has(id)) roots.push(id);
  }
  return roots;
}

function findLeaves(graph) {
  const hasOutgoing = new Set();
  for (const edge of graph.edges) {
    hasOutgoing.add(edge.from);
  }
  const leaves = [];
  for (const [id] of graph.nodes) {
    if (!hasOutgoing.has(id)) leaves.push(id);
  }
  return leaves;
}

function findOrphans(graph) {
  const connected = new Set();
  for (const edge of graph.edges) {
    connected.add(edge.from);
    connected.add(edge.to);
  }
  const orphans = [];
  for (const [id] of graph.nodes) {
    if (!connected.has(id)) orphans.push(id);
  }
  return orphans;
}

function findCycles(graph) {
  const adj = new Map();
  for (const edge of graph.edges) {
    if (!adj.has(edge.from)) adj.set(edge.from, []);
    adj.get(edge.from).push(edge.to);
  }

  const visited = new Set();
  const inStack = new Set();
  const cycles = [];

  function dfs(node, path) {
    if (inStack.has(node)) {
      const cycleStart = path.indexOf(node);
      if (cycleStart >= 0) cycles.push(path.slice(cycleStart).concat(node));
      return;
    }
    if (visited.has(node)) return;

    visited.add(node);
    inStack.add(node);
    path.push(node);

    const neighbors = adj.get(node) || [];
    for (const n of neighbors) {
      dfs(n, path);
    }

    path.pop();
    inStack.delete(node);
  }

  for (const [id] of graph.nodes) {
    if (!visited.has(id)) dfs(id, []);
  }

  return cycles;
}

function getTransitiveDeps(graph, nodeId) {
  const adj = new Map();
  for (const edge of graph.edges) {
    if (!adj.has(edge.from)) adj.set(edge.from, []);
    adj.get(edge.from).push(edge.to);
  }

  const visited = new Set();
  const queue = [nodeId];
  while (queue.length > 0) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);
    const neighbors = adj.get(current) || [];
    for (const n of neighbors) {
      if (!visited.has(n)) queue.push(n);
    }
  }

  visited.delete(nodeId);
  return Array.from(visited);
}

function graphStats(graph) {
  const roots = findRoots(graph);
  const leaves = findLeaves(graph);
  const orphans = findOrphans(graph);
  const cycles = findCycles(graph);

  const inDegree = new Map();
  const outDegree = new Map();
  for (const [id] of graph.nodes) {
    inDegree.set(id, 0);
    outDegree.set(id, 0);
  }
  for (const edge of graph.edges) {
    inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
    outDegree.set(edge.from, (outDegree.get(edge.from) || 0) + 1);
  }

  const maxFanOut = Math.max(0, ...outDegree.values());
  const maxFanIn = Math.max(0, ...inDegree.values());

  return {
    nodes: graph.nodes.size,
    edges: graph.edges.length,
    roots: roots.length,
    leaves: leaves.length,
    orphans: orphans.length,
    cycles: cycles.length,
    maxFanOut,
    maxFanIn,
    density: graph.nodes.size > 1 ? Math.round(graph.edges.length / (graph.nodes.size * (graph.nodes.size - 1)) * 1000) / 1000 : 0
  };
}

function formatGraph(stats) {
  const lines = [];
  lines.push('Dependency Graph Analysis');
  lines.push('========================');
  lines.push(`Nodes: ${stats.nodes}`);
  lines.push(`Edges: ${stats.edges}`);
  lines.push(`Roots: ${stats.roots}`);
  lines.push(`Leaves: ${stats.leaves}`);
  lines.push(`Orphans: ${stats.orphans}`);
  lines.push(`Cycles: ${stats.cycles}`);
  lines.push(`Max fan-out: ${stats.maxFanOut}`);
  lines.push(`Max fan-in: ${stats.maxFanIn}`);
  lines.push(`Density: ${stats.density}`);
  return lines.join('\n');
}

module.exports = { buildGraph, findRoots, findLeaves, findOrphans, findCycles, getTransitiveDeps, graphStats, formatGraph };
