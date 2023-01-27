function formatResult(result) {
  const lines = [];

  lines.push(`# bomprobe report`);
  lines.push('');
  lines.push(`**File:** ${result.file}`);
  lines.push(`**Format:** ${result.format} (${result.componentCount} components)`);
  lines.push(`**Score:** ${result.score.overall}/10`);
  lines.push('');
  lines.push('## Scores');
  lines.push('');
  lines.push('| Category | Score |');
  lines.push('|----------|-------|');
  lines.push(`| Components | ${result.score.components.average}/10 |`);
  lines.push(`| Metadata | ${result.score.metadata}/10 |`);
  lines.push(`| Dependencies | ${result.score.dependencyCoverage}/10 |`);

  const findings = [];
  for (const check of result.checks) {
    for (const f of check.findings) {
      findings.push(f);
    }
  }

  if (findings.length > 0) {
    lines.push('');
    lines.push('## Issues');
    lines.push('');
    lines.push('| Severity | Message |');
    lines.push('|----------|---------|');
    for (const f of findings) {
      const sev = f.severity.toUpperCase();
      lines.push(`| ${sev} | ${f.message} |`);
    }
  }

  if (result.compliance) {
    lines.push('');
    lines.push(`## NTIA Compliance: ${result.compliance.compliant ? 'PASS' : 'FAIL'}`);
    lines.push('');
    lines.push(result.compliance.summary);
    if (result.compliance.failed.length > 0) {
      lines.push('');
      for (const f of result.compliance.failed) {
        lines.push(`- **${f.id}:** ${f.reason}`);
      }
    }
  }

  return lines.join('\n');
}

module.exports = { formatResult };
