function componentKey(c) {
  return `${c.name || ''}@${c.version || ''}`;
}

function diffComponents(before, after) {
  const beforeMap = new Map();
  const afterMap = new Map();

  for (const c of (before || [])) beforeMap.set(componentKey(c), c);
  for (const c of (after || [])) afterMap.set(componentKey(c), c);

  const added = [];
  const removed = [];
  const modified = [];
  const unchanged = [];

  for (const [key, c] of afterMap) {
    if (!beforeMap.has(key)) {
      added.push(c);
    } else {
      const old = beforeMap.get(key);
      const changes = diffFields(old, c);
      if (changes.length > 0) {
        modified.push({ component: c, changes });
      } else {
        unchanged.push(c);
      }
    }
  }

  for (const [key, c] of beforeMap) {
    if (!afterMap.has(key)) removed.push(c);
  }

  return { added, removed, modified, unchanged };
}

function diffFields(a, b) {
  const changes = [];
  const fields = ['type', 'purl', 'supplier', 'description', 'copyright', 'scope', 'group'];
  for (const f of fields) {
    const av = JSON.stringify(a[f]);
    const bv = JSON.stringify(b[f]);
    if (av !== bv) changes.push({ field: f, before: a[f], after: b[f] });
  }

  const aHash = (a.hashes || []).map(h => `${h.alg}:${h.content}`).sort().join(',');
  const bHash = (b.hashes || []).map(h => `${h.alg}:${h.content}`).sort().join(',');
  if (aHash !== bHash) changes.push({ field: 'hashes', before: a.hashes, after: b.hashes });

  const aLic = JSON.stringify(a.licenses || []);
  const bLic = JSON.stringify(b.licenses || []);
  if (aLic !== bLic) changes.push({ field: 'licenses', before: a.licenses, after: b.licenses });

  return changes;
}

function diffMetadata(before, after) {
  const changes = [];
  const bm = before || {};
  const am = after || {};

  if (bm.timestamp !== am.timestamp) changes.push({ field: 'timestamp', before: bm.timestamp, after: am.timestamp });

  const bTools = JSON.stringify(bm.tools || []);
  const aTools = JSON.stringify(am.tools || []);
  if (bTools !== aTools) changes.push({ field: 'tools', before: bm.tools, after: am.tools });

  return changes;
}

function compareSboms(before, after) {
  const components = diffComponents(before.components, after.components);
  const metadata = diffMetadata(before.metadata, after.metadata);

  return {
    summary: {
      beforeCount: (before.components || []).length,
      afterCount: (after.components || []).length,
      added: components.added.length,
      removed: components.removed.length,
      modified: components.modified.length,
      unchanged: components.unchanged.length
    },
    components,
    metadata
  };
}

module.exports = { compareSboms, diffComponents, diffFields, diffMetadata };
