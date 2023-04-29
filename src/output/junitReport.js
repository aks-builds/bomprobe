function formatJunitReport(results, bomFile = 'sbom.json') {
  const testcases = [];
  let failures = 0;
  let total = 0;

  for (const r of results) {
    total++;
    if (r.findings && r.findings.length > 0) {
      const errorFindings = r.findings.filter(f => f.severity === 'error');
      const warnFindings = r.findings.filter(f => f.severity === 'warning');

      if (errorFindings.length > 0) {
        failures++;
        testcases.push(
          `    <testcase name="${escapeXml(r.id)}" classname="bomprobe">` +
          `\n      <failure message="${escapeXml(errorFindings[0].message)}" />` +
          `\n    </testcase>`
        );
      } else if (warnFindings.length > 0) {
        testcases.push(
          `    <testcase name="${escapeXml(r.id)}" classname="bomprobe">` +
          `\n      <system-out>${escapeXml(warnFindings.map(f => f.message).join('\n'))}</system-out>` +
          `\n    </testcase>`
        );
      } else {
        testcases.push(`    <testcase name="${escapeXml(r.id)}" classname="bomprobe" />`);
      }
    } else {
      testcases.push(`    <testcase name="${escapeXml(r.id)}" classname="bomprobe" />`);
    }
  }

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<testsuites>`,
    `  <testsuite name="bomprobe" tests="${total}" failures="${failures}" file="${escapeXml(bomFile)}">`,
    testcases.join('\n'),
    '  </testsuite>',
    '</testsuites>'
  ].join('\n');
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = { formatJunitReport };
