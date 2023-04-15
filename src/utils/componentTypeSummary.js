const KNOWN_TYPES = new Set([
  'application', 'framework', 'library', 'container',
  'platform', 'operating-system', 'device', 'device-driver',
  'firmware', 'file', 'machine-learning-model', 'data'
]);

function summarizeTypes(components) {
  const counts = {};
  let unknown = 0;

  for (const c of components) {
    const type = (c.type || 'unspecified').toLowerCase();
    if (type === 'unspecified' || !KNOWN_TYPES.has(type)) {
      unknown++;
    }
    counts[type] = (counts[type] || 0) + 1;
  }

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({ type, count, pct: Math.round((count / components.length) * 100) }));

  return { types: sorted, total: components.length, unknown };
}

module.exports = { summarizeTypes, KNOWN_TYPES };
