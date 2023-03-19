function formatResult(result) {
  const totalTests = result.checks.length;
  let failures = 0;
  let testcases = '';

  for (const check of result.checks) {
    if (check.findings.length === 0) {
      testcases += `    <testcase name="${check.name}" classname="bomprobe.${check.id}" time="0"/>\n`;
    } else {
      failures++;
      const messages = check.findings.map(f => `[${f.severity}] ${f.message}`).join('\n');
      testcases += `    <testcase name="${check.name}" classname="bomprobe.${check.id}" time="0">\n`;
      testcases += `      <failure message="${check.findings.length} finding(s)"><![CDATA[${messages}]]></failure>\n`;
      testcases += `    </testcase>\n`;
    }
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<testsuites>\n`;
  xml += `  <testsuite name="bomprobe" tests="${totalTests}" failures="${failures}" file="${result.file}">\n`;
  xml += testcases;
  xml += `  </testsuite>\n`;
  xml += `</testsuites>`;

  return xml;
}

module.exports = { formatResult };
