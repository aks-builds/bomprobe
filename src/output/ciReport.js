function formatGitHubAnnotations(result) {
  const lines = [];
  for (const check of result.checks || []) {
    for (const f of check.findings || []) {
      const level = f.severity === 'error' ? 'error' : f.severity === 'warning' ? 'warning' : 'notice';
      const title = check.name || check.id;
      const msg = f.message.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
      lines.push(`::${level} title=${title}::${msg}`);
    }
  }
  return lines.join('\n');
}

function formatGitLabCodeQuality(result) {
  const issues = [];
  for (const check of result.checks || []) {
    for (const f of check.findings || []) {
      issues.push({
        description: f.message,
        check_name: check.id,
        severity: mapSeverity(f.severity),
        fingerprint: fingerprint(check.id, f.message),
        location: { path: 'sbom.json', lines: { begin: 1 } }
      });
    }
  }
  return JSON.stringify(issues, null, 2);
}

function formatJUnit(result) {
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>'];
  const checks = result.checks || [];
  let totalFailures = 0;
  for (const c of checks) {
    totalFailures += (c.findings || []).filter(f => f.severity === 'error').length;
  }

  lines.push(`<testsuites tests="${checks.length}" failures="${totalFailures}">`);
  for (const check of checks) {
    const failures = (check.findings || []).filter(f => f.severity === 'error');
    lines.push(`  <testsuite name="${esc(check.name || check.id)}" tests="1" failures="${failures.length}">`);
    lines.push(`    <testcase name="${esc(check.id)}" classname="bomprobe">`);
    for (const f of failures) {
      lines.push(`      <failure message="${esc(f.message)}">${esc(f.message)}</failure>`);
    }
    lines.push('    </testcase>');
    lines.push('  </testsuite>');
  }
  lines.push('</testsuites>');
  return lines.join('\n');
}

function mapSeverity(sev) {
  if (sev === 'error') return 'critical';
  if (sev === 'warning') return 'major';
  return 'minor';
}

function fingerprint(id, msg) {
  let hash = 0;
  const str = `${id}:${msg}`;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

module.exports = { formatGitHubAnnotations, formatGitLabCodeQuality, formatJUnit };
