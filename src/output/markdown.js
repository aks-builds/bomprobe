function formatMarkdown(result) {
  const lines = [];
  const score = typeof result.score === 'object' ? result.score.overall : result.score;
  const grade = result.grade || '';

  lines.push(`# SBOM Audit Report`);
  lines.push('');
  lines.push(`**Score:** ${score}/100 (${grade})`);
  lines.push(`**Checks run:** ${result.results?.length || 0}`);
  lines.push('');

  const findings = (result.results || []).filter(r => r.findings.length > 0);
  if (findings.length === 0) {
    lines.push('All checks passed with no findings.');
    return lines.join('\n');
  }

  lines.push('## Findings');
  lines.push('');
  lines.push('| Check | Severity | Detail |');
  lines.push('|-------|----------|--------|');

  for (const r of findings) {
    for (const f of r.findings) {
      const sev = f.severity || 'info';
      const msg = (f.message || '').replace(/\|/g, '\\|');
      lines.push(`| ${r.name} | ${sev} | ${msg} |`);
    }
  }

  lines.push('');

  const warnings = findings.reduce((n, r) => n + r.findings.filter(f => f.severity === 'warning').length, 0);
  const errors = findings.reduce((n, r) => n + r.findings.filter(f => f.severity === 'error').length, 0);
  const infos = findings.reduce((n, r) => n + r.findings.filter(f => f.severity === 'info').length, 0);

  lines.push(`## Summary`);
  lines.push('');
  lines.push(`- Errors: ${errors}`);
  lines.push(`- Warnings: ${warnings}`);
  lines.push(`- Info: ${infos}`);

  return lines.join('\n');
}

module.exports = { formatMarkdown };
