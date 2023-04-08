function buildTree(dependencies) {
  const tree = {};
  for (const dep of dependencies) {
    tree[dep.ref] = dep.dependsOn || [];
  }
  return tree;
}

function findRoots(tree) {
  const allChildren = new Set();
  for (const children of Object.values(tree)) {
    for (const child of children) {
      allChildren.add(child);
    }
  }
  return Object.keys(tree).filter(k => !allChildren.has(k));
}

function maxDepth(tree) {
  const visited = new Set();
  function walk(node, depth) {
    if (visited.has(node)) return depth;
    visited.add(node);
    const children = tree[node] || [];
    if (children.length === 0) return depth;
    return Math.max(...children.map(c => walk(c, depth + 1)));
  }
  const roots = findRoots(tree);
  if (roots.length === 0) return 0;
  return Math.max(...roots.map(r => walk(r, 0)));
}

function flatDependencies(tree, ref) {
  const result = new Set();
  const queue = [ref];
  while (queue.length > 0) {
    const current = queue.shift();
    for (const child of tree[current] || []) {
      if (!result.has(child)) {
        result.add(child);
        queue.push(child);
      }
    }
  }
  return [...result];
}

module.exports = { buildTree, findRoots, maxDepth, flatDependencies };
