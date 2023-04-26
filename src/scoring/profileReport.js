function formatProfileReport(profileName, results) {
  const lines = [`Profile: ${profileName}`];
  lines.push('='.repeat(40));

  let total = 0;
  let weighted = 0;
  let checked = 0;

  for (const r of results) {
    const score = r.findings.length === 0 ? 1 : 0;
    total += r.weight;
    weighted += score * r.weight;
    checked++;
    const status = score ? 'PASS' : 'FAIL';
    lines.push(`  [${status}] ${r.id} (weight: ${r.weight})`);
  }

  const pct = total > 0 ? Math.round((weighted / total) * 100) : 0;
  lines.push('');
  lines.push(`Checks: ${checked}`);
  lines.push(`Score: ${pct}%`);
  lines.push(`Rating: ${pct >= 80 ? 'Good' : pct >= 50 ? 'Fair' : 'Poor'}`);

  return lines.join('\n');
}

function formatProfileJson(profileName, results) {
  const checks = results.map(r => ({
    id: r.id,
    passed: r.findings.length === 0,
    weight: r.weight,
    findingCount: r.findings.length
  }));

  let total = 0;
  let weighted = 0;
  for (const c of checks) {
    total += c.weight;
    if (c.passed) weighted += c.weight;
  }

  return {
    profile: profileName,
    score: total > 0 ? Math.round((weighted / total) * 100) : 0,
    checks
  };
}

module.exports = { formatProfileReport, formatProfileJson };
