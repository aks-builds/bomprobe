function findingsToMarkdownTable(findings) {
  if (!findings.length) return 'No findings.';

  const lines = ['| Severity | Check | Component | Message |'];
  lines.push('|----------|-------|-----------|---------|');

  for (const f of findings) {
    const sev = escapeMd(f.severity || 'info');
    const check = escapeMd(f.checkId || '');
    const comp = escapeMd(f.component || '-');
    const msg = escapeMd(f.message || '');
    lines.push(`| ${sev} | ${check} | ${comp} | ${msg} |`);
  }

  return lines.join('\n');
}

function summaryToMarkdownTable(summary) {
  const lines = ['| Metric | Value |'];
  lines.push('|--------|-------|');

  for (const [key, val] of Object.entries(summary)) {
    lines.push(`| ${escapeMd(key)} | ${escapeMd(String(val))} |`);
  }

  return lines.join('\n');
}

function escapeMd(str) {
  return str.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

module.exports = { findingsToMarkdownTable, summaryToMarkdownTable };
