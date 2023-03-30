function generateReport(result) {
  const lines = [];
  lines.push(`# SBOM Quality Report`);
  lines.push('');
  lines.push(`File: ${result.file}`);
  lines.push(`Format: ${result.format}`);
  lines.push(`Components: ${result.componentCount}`);
  lines.push(`Score: ${result.score.overall}/10`);
  lines.push('');

  if (result.compliance) {
    lines.push(`## Compliance: ${result.compliance.profile}`);
    lines.push(`Status: ${result.compliance.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}`);
    lines.push(result.compliance.summary);
    lines.push('');
  }

  const withFindings = result.checks.filter(c => c.findings.length > 0);
  if (withFindings.length > 0) {
    lines.push('## Findings');
    lines.push('');
    for (const check of withFindings) {
      lines.push(`### ${check.name}`);
      for (const f of check.findings) {
        lines.push(`- [${f.severity}] ${f.component || '-'}: ${f.message}`);
      }
      lines.push('');
    }
  } else {
    lines.push('No findings. This SBOM meets all quality checks.');
  }

  return lines.join('\n');
}

module.exports = { generateReport };
