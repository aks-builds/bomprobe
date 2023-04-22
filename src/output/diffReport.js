const { diffSboms } = require('../utils/bomDiff');

function formatDiffText(before, after) {
  const diff = diffSboms(before, after);
  const lines = [];

  lines.push('SBOM Diff Report');
  lines.push('================');
  lines.push('');

  lines.push(`Added: ${diff.added.length}`);
  lines.push(`Removed: ${diff.removed.length}`);
  lines.push(`Changed: ${diff.changed.length}`);
  lines.push(`Unchanged: ${diff.unchanged.length}`);
  lines.push('');

  if (diff.added.length > 0) {
    lines.push('Added components:');
    for (const c of diff.added) {
      lines.push(`  + ${c.name}@${c.version || 'unknown'}`);
    }
    lines.push('');
  }

  if (diff.removed.length > 0) {
    lines.push('Removed components:');
    for (const c of diff.removed) {
      lines.push(`  - ${c.name}@${c.version || 'unknown'}`);
    }
    lines.push('');
  }

  if (diff.changed.length > 0) {
    lines.push('Changed components:');
    for (const entry of diff.changed) {
      lines.push(`  ~ ${entry.component.name}`);
      for (const change of entry.changes) {
        lines.push(`    ${change.field}: ${change.before || '(none)'} -> ${change.after || '(none)'}`);
      }
    }
  }

  return lines.join('\n');
}

function formatDiffJson(before, after) {
  const diff = diffSboms(before, after);
  return JSON.stringify({
    summary: {
      added: diff.added.length,
      removed: diff.removed.length,
      changed: diff.changed.length,
      unchanged: diff.unchanged.length
    },
    added: diff.added.map(c => ({ name: c.name, version: c.version })),
    removed: diff.removed.map(c => ({ name: c.name, version: c.version })),
    changed: diff.changed.map(e => ({
      name: e.component.name,
      changes: e.changes
    }))
  }, null, 2);
}

module.exports = { formatDiffText, formatDiffJson };
