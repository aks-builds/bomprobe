function formatStats(stats) {
  const lines = [];

  lines.push('SBOM Statistics');
  lines.push('===============');
  lines.push('');
  lines.push(`Format: ${stats.format} ${stats.specVersion || ''}`);
  lines.push(`Components: ${stats.componentCount}`);
  lines.push(`Metadata: ${stats.hasMetadata ? 'present' : 'missing'}`);
  lines.push(`Timestamp: ${stats.hasTimestamp ? 'present' : 'missing'}`);
  lines.push(`Dependencies: ${stats.hasDependencies ? 'present' : 'missing'}`);
  lines.push('');

  lines.push('Coverage:');
  for (const [field, pct] of Object.entries(stats.coverage)) {
    const bar = renderBar(pct);
    lines.push(`  ${field.padEnd(10)} ${bar} ${pct}%`);
  }
  lines.push('');

  if (stats.types && stats.types.types.length > 0) {
    lines.push('Component Types:');
    for (const t of stats.types.types) {
      lines.push(`  ${t.type}: ${t.count} (${t.pct}%)`);
    }
    lines.push('');
  }

  lines.push('License Breakdown:');
  for (const [cat, count] of Object.entries(stats.licenses)) {
    if (count > 0) {
      lines.push(`  ${cat}: ${count}`);
    }
  }

  return lines.join('\n');
}

function renderBar(pct) {
  const filled = Math.round(pct / 5);
  const empty = 20 - filled;
  return '[' + '#'.repeat(filled) + '.'.repeat(empty) + ']';
}

function statsToJson(stats) {
  return JSON.stringify(stats, null, 2);
}

module.exports = { formatStats, statsToJson };
