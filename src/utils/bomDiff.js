function diffSboms(before, after) {
  const beforeMap = new Map();
  const afterMap = new Map();

  for (const c of (before.components || [])) {
    beforeMap.set(componentKey(c), c);
  }
  for (const c of (after.components || [])) {
    afterMap.set(componentKey(c), c);
  }

  const added = [];
  const removed = [];
  const changed = [];
  const unchanged = [];

  for (const [key, c] of afterMap) {
    if (!beforeMap.has(key)) {
      added.push(c);
    } else {
      const prev = beforeMap.get(key);
      const diffs = fieldDiffs(prev, c);
      if (diffs.length > 0) {
        changed.push({ component: c, changes: diffs });
      } else {
        unchanged.push(c);
      }
    }
  }

  for (const [key, c] of beforeMap) {
    if (!afterMap.has(key)) {
      removed.push(c);
    }
  }

  return { added, removed, changed, unchanged };
}

function componentKey(c) {
  return `${(c.name || '').toLowerCase()}@${c.version || ''}`;
}

function fieldDiffs(a, b) {
  const fields = ['version', 'purl', 'type', 'scope', 'description'];
  const diffs = [];
  for (const f of fields) {
    if (a[f] !== b[f]) {
      diffs.push({ field: f, before: a[f], after: b[f] });
    }
  }

  const aLic = extractLicense(a);
  const bLic = extractLicense(b);
  if (aLic !== bLic) {
    diffs.push({ field: 'license', before: aLic, after: bLic });
  }

  return diffs;
}

function extractLicense(c) {
  if (c.licenses?.length > 0) {
    return c.licenses.map(l => l.license?.id || l.id || '').join(', ');
  }
  return '';
}

module.exports = { diffSboms };
