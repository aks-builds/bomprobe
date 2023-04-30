function formatDiffText(diff) {
  const lines = [];
  const s = diff.summary;

  lines.push('SBOM Diff Report');
  lines.push('================');
  lines.push(`Components: ${s.beforeCount} -> ${s.afterCount}`);
  lines.push(`  Added:     +${s.added}`);
  lines.push(`  Removed:   -${s.removed}`);
  lines.push(`  Modified:   ${s.modified}`);
  lines.push(`  Unchanged:  ${s.unchanged}`);
  lines.push('');

  if (diff.components.added.length > 0) {
    lines.push('Added components:');
    for (const c of diff.components.added) {
      lines.push(`  + ${c.name}@${c.version || 'unknown'}`);
    }
    lines.push('');
  }

  if (diff.components.removed.length > 0) {
    lines.push('Removed components:');
    for (const c of diff.components.removed) {
      lines.push(`  - ${c.name}@${c.version || 'unknown'}`);
    }
    lines.push('');
  }

  if (diff.components.modified.length > 0) {
    lines.push('Modified components:');
    for (const m of diff.components.modified) {
      lines.push(`  ~ ${m.component.name}@${m.component.version || 'unknown'}`);
      for (const ch of m.changes) {
        lines.push(`      ${ch.field}: ${JSON.stringify(ch.before)} -> ${JSON.stringify(ch.after)}`);
      }
    }
    lines.push('');
  }

  if (diff.metadata.length > 0) {
    lines.push('Metadata changes:');
    for (const ch of diff.metadata) {
      lines.push(`  ${ch.field}: ${JSON.stringify(ch.before)} -> ${JSON.stringify(ch.after)}`);
    }
  }

  return lines.join('\n');
}

function formatDiffJson(diff) {
  return JSON.stringify(diff, null, 2);
}

function formatDiffMarkdown(diff) {
  const lines = [];
  const s = diff.summary;

  lines.push('# SBOM Diff Report');
  lines.push('');
  lines.push(`| Metric | Count |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Before | ${s.beforeCount} |`);
  lines.push(`| After | ${s.afterCount} |`);
  lines.push(`| Added | +${s.added} |`);
  lines.push(`| Removed | -${s.removed} |`);
  lines.push(`| Modified | ${s.modified} |`);
  lines.push(`| Unchanged | ${s.unchanged} |`);
  lines.push('');

  if (diff.components.added.length > 0) {
    lines.push('## Added');
    for (const c of diff.components.added) lines.push(`- \`${c.name}@${c.version || 'unknown'}\``);
    lines.push('');
  }

  if (diff.components.removed.length > 0) {
    lines.push('## Removed');
    for (const c of diff.components.removed) lines.push(`- \`${c.name}@${c.version || 'unknown'}\``);
    lines.push('');
  }

  if (diff.components.modified.length > 0) {
    lines.push('## Modified');
    for (const m of diff.components.modified) {
      lines.push(`### \`${m.component.name}@${m.component.version || 'unknown'}\``);
      for (const ch of m.changes) {
        lines.push(`- **${ch.field}**: \`${JSON.stringify(ch.before)}\` -> \`${JSON.stringify(ch.after)}\``);
      }
    }
  }

  return lines.join('\n');
}

module.exports = { formatDiffText, formatDiffJson, formatDiffMarkdown };
