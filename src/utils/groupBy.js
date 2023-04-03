function groupBy(items, keyFn) {
  const groups = {};
  for (const item of items) {
    const key = keyFn(item);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return groups;
}

function groupBySeverity(checks) {
  const all = [];
  for (const check of checks) {
    for (const f of check.findings) {
      all.push({ ...f, checkId: check.id, checkName: check.name });
    }
  }
  return groupBy(all, f => f.severity);
}

function groupByComponent(checks) {
  const all = [];
  for (const check of checks) {
    for (const f of check.findings) {
      all.push({ ...f, checkId: check.id, checkName: check.name });
    }
  }
  return groupBy(all, f => f.component || 'unknown');
}

module.exports = { groupBy, groupBySeverity, groupByComponent };
