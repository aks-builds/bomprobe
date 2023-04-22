function buildAdjacencyList(dependencies) {
  const graph = new Map();
  for (const dep of (dependencies || [])) {
    const ref = dep.ref || dep.dependsOn?.[0];
    if (!ref) continue;
    if (!graph.has(ref)) graph.set(ref, []);
    for (const child of (dep.dependsOn || [])) {
      if (child !== ref) graph.get(ref).push(child);
      if (!graph.has(child)) graph.set(child, []);
    }
  }
  return graph;
}

function detectCycles(graph) {
  const visited = new Set();
  const inStack = new Set();
  const cycles = [];

  function dfs(node, path) {
    if (inStack.has(node)) {
      const cycleStart = path.indexOf(node);
      cycles.push(path.slice(cycleStart).concat(node));
      return;
    }
    if (visited.has(node)) return;
    visited.add(node);
    inStack.add(node);
    path.push(node);
    for (const neighbor of (graph.get(node) || [])) {
      dfs(neighbor, path);
    }
    path.pop();
    inStack.delete(node);
  }

  for (const node of graph.keys()) {
    if (!visited.has(node)) dfs(node, []);
  }
  return cycles;
}

function topologicalSort(graph) {
  const inDegree = new Map();
  for (const node of graph.keys()) {
    if (!inDegree.has(node)) inDegree.set(node, 0);
    for (const neighbor of (graph.get(node) || [])) {
      inDegree.set(neighbor, (inDegree.get(neighbor) || 0) + 1);
    }
  }

  const queue = [];
  for (const [node, deg] of inDegree) {
    if (deg === 0) queue.push(node);
  }

  const sorted = [];
  while (queue.length > 0) {
    const node = queue.shift();
    sorted.push(node);
    for (const neighbor of (graph.get(node) || [])) {
      inDegree.set(neighbor, inDegree.get(neighbor) - 1);
      if (inDegree.get(neighbor) === 0) queue.push(neighbor);
    }
  }

  return { sorted, hasCycle: sorted.length < graph.size };
}

module.exports = { buildAdjacencyList, detectCycles, topologicalSort };
