function compareComponents(before, after) {
  const beforeMap = new Map(before.map(c => [c.purl || c.name, c]));
  const afterMap = new Map(after.map(c => [c.purl || c.name, c]));

  const added = [];
  const removed = [];
  const versionChanged = [];
  const unchanged = [];

  for (const [key, comp] of afterMap) {
    if (!beforeMap.has(key)) {
      added.push(comp);
    } else {
      const old = beforeMap.get(key);
      if (old.version !== comp.version) {
        versionChanged.push({ name: comp.name, from: old.version, to: comp.version });
      } else {
        unchanged.push(comp);
      }
    }
  }

  for (const [key, comp] of beforeMap) {
    if (!afterMap.has(key)) {
      removed.push(comp);
    }
  }

  return { added, removed, versionChanged, unchanged };
}

function compareSummary(diff) {
  return {
    addedCount: diff.added.length,
    removedCount: diff.removed.length,
    changedCount: diff.versionChanged.length,
    unchangedCount: diff.unchanged.length,
    totalDelta: diff.added.length - diff.removed.length
  };
}

module.exports = { compareComponents, compareSummary };
