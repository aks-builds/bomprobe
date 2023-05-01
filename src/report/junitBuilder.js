function buildJunit(auditResult) {
  const checks = Array.isArray(auditResult.checks) ? auditResult.checks : [];
  const testcases = [];
  let failures = 0;
  let errors = 0;

  for (const check of checks) {
    const findings = Array.isArray(check.findings) ? check.findings : [];
    if (findings.length === 0) {
      testcases.push({ name: check.id, classname: 'bomprobe.checks', status: 'pass' });
    } else {
      for (const f of findings) {
        const sev = (f.severity || check.severity || 'info').toLowerCase();
        if (sev === 'error' || sev === 'critical') errors++;
        else failures++;

        testcases.push({
          name: `${check.id}: ${f.component || 'general'}`,
          classname: 'bomprobe.checks',
          status: sev === 'error' || sev === 'critical' ? 'error' : 'failure',
          message: f.message || check.id,
          severity: sev
        });
      }
    }
  }

  return {
    name: 'bomprobe',
    tests: testcases.length,
    failures,
    errors,
    time: 0,
    testcases
  };
}

function formatJunit(result) {
  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push(`<testsuite name="${esc(result.name)}" tests="${result.tests}" failures="${result.failures}" errors="${result.errors}" time="${result.time}">`);

  for (const tc of result.testcases) {
    if (tc.status === 'pass') {
      lines.push(`  <testcase name="${esc(tc.name)}" classname="${esc(tc.classname)}" />`);
    } else if (tc.status === 'error') {
      lines.push(`  <testcase name="${esc(tc.name)}" classname="${esc(tc.classname)}">`);
      lines.push(`    <error message="${esc(tc.message)}" type="${esc(tc.severity)}" />`);
      lines.push('  </testcase>');
    } else {
      lines.push(`  <testcase name="${esc(tc.name)}" classname="${esc(tc.classname)}">`);
      lines.push(`    <failure message="${esc(tc.message)}" type="${esc(tc.severity)}" />`);
      lines.push('  </testcase>');
    }
  }

  lines.push('</testsuite>');
  return lines.join('\n');
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

module.exports = { buildJunit, formatJunit, esc };
