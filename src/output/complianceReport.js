function formatComplianceText(profiles) {
  const lines = ['Compliance Report', '='.repeat(40)];

  for (const p of profiles) {
    const status = p.score >= 100 ? 'PASS' : p.score >= 80 ? 'PARTIAL' : 'FAIL';
    lines.push('');
    lines.push(`${p.profile}: ${status} (${p.score}%)`);
    lines.push(`  Met: ${p.met}/${p.total} requirements`);

    for (const f of p.findings || []) {
      const icon = f.met ? '+' : '-';
      lines.push(`  ${icon} ${f.requirement}`);
    }
  }

  return lines.join('\n');
}

function formatComplianceJson(profiles) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    profiles: profiles.map(p => ({
      profile: p.profile,
      status: p.score >= 100 ? 'pass' : p.score >= 80 ? 'partial' : 'fail',
      score: p.score,
      met: p.met,
      total: p.total,
      findings: p.findings
    }))
  }, null, 2);
}

function formatComplianceMarkdown(profiles) {
  const lines = ['# Compliance Report', ''];

  for (const p of profiles) {
    const status = p.score >= 100 ? 'PASS' : p.score >= 80 ? 'PARTIAL' : 'FAIL';
    lines.push(`## ${p.profile} - ${status} (${p.score}%)`);
    lines.push('');
    lines.push(`Met ${p.met} of ${p.total} requirements.`);
    lines.push('');

    for (const f of p.findings || []) {
      const icon = f.met ? '[x]' : '[ ]';
      lines.push(`- ${icon} ${f.requirement}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

module.exports = { formatComplianceText, formatComplianceJson, formatComplianceMarkdown };
