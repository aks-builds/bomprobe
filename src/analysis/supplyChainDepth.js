function buildGraph(dependencies) {
  const graph = new Map();
  for (const dep of (dependencies || [])) {
    graph.set(dep.ref, dep.dependsOn || []);
  }
  return graph;
}

function findRoots(graph, components) {
  const allChildren = new Set();
  for (const deps of graph.values()) {
    for (const d of deps) allChildren.add(d);
  }
  const roots = [];
  for (const c of (components || [])) {
    const ref = c['bom-ref'] || c.purl || c.name;
    if (ref && !allChildren.has(ref)) roots.push(ref);
  }
  return roots.length > 0 ? roots : [...graph.keys()].slice(0, 1);
}

function measureDepth(graph, roots) {
  const depths = new Map();

  function dfs(node, depth, visited) {
    if (visited.has(node)) return;
    visited.add(node);
    const current = depths.get(node) || 0;
    if (depth > current) depths.set(node, depth);
    const children = graph.get(node) || [];
    for (const child of children) dfs(child, depth + 1, visited);
  }

  for (const root of roots) dfs(root, 0, new Set());
  return depths;
}

function analyzeSupplyChain(sbom) {
  const graph = buildGraph(sbom.dependencies);
  const roots = findRoots(graph, sbom.components);
  const depths = measureDepth(graph, roots);

  let maxDepth = 0;
  let deepestNode = null;
  const depthDistribution = {};

  for (const [node, depth] of depths) {
    if (depth > maxDepth) { maxDepth = depth; deepestNode = node; }
    depthDistribution[depth] = (depthDistribution[depth] || 0) + 1;
  }

  const directDeps = roots.flatMap(r => graph.get(r) || []);
  const transitiveDeps = new Set();
  for (const [node, depth] of depths) {
    if (depth > 1) transitiveDeps.add(node);
  }

  const totalNodes = depths.size;
  const avgDepth = totalNodes > 0
    ? Math.round([...depths.values()].reduce((a, b) => a + b, 0) / totalNodes * 10) / 10
    : 0;

  return {
    maxDepth,
    deepestNode,
    avgDepth,
    directCount: directDeps.length,
    transitiveCount: transitiveDeps.size,
    totalNodes,
    depthDistribution,
    roots,
    warnings: generateWarnings(maxDepth, transitiveDeps.size, totalNodes)
  };
}

function generateWarnings(maxDepth, transitiveCount, total) {
  const warnings = [];
  if (maxDepth > 10) {
    warnings.push({ severity: 'warning', message: `Dependency chain depth ${maxDepth} exceeds recommended maximum of 10` });
  }
  if (total > 0 && transitiveCount / total > 0.8) {
    warnings.push({ severity: 'info', message: `${Math.round(transitiveCount / total * 100)}% of dependencies are transitive` });
  }
  return warnings;
}

function formatSupplyChain(analysis) {
  const lines = [];
  lines.push('Supply Chain Depth Analysis');
  lines.push('==========================');
  lines.push(`Total nodes:      ${analysis.totalNodes}`);
  lines.push(`Direct deps:      ${analysis.directCount}`);
  lines.push(`Transitive deps:  ${analysis.transitiveCount}`);
  lines.push(`Max depth:        ${analysis.maxDepth}`);
  lines.push(`Avg depth:        ${analysis.avgDepth}`);
  if (analysis.deepestNode) {
    lines.push(`Deepest node:     ${analysis.deepestNode}`);
  }
  lines.push('');
  lines.push('Depth distribution:');
  for (const [d, c] of Object.entries(analysis.depthDistribution).sort((a, b) => a[0] - b[0])) {
    const bar = '#'.repeat(Math.min(c, 50));
    lines.push(`  ${d}: ${bar} (${c})`);
  }

  if (analysis.warnings.length > 0) {
    lines.push('');
    lines.push('Warnings:');
    for (const w of analysis.warnings) lines.push(`  [${w.severity}] ${w.message}`);
  }

  return lines.join('\n');
}

module.exports = { analyzeSupplyChain, formatSupplyChain, buildGraph, findRoots, measureDepth };
