function formatResult(result) {
  const errors = result.checks.reduce(
    (n, c) => n + c.findings.filter(f => f.severity === 'error').length, 0
  );
  const warnings = result.checks.reduce(
    (n, c) => n + c.findings.filter(f => f.severity === 'warning').length, 0
  );
  const infos = result.checks.reduce(
    (n, c) => n + c.findings.filter(f => f.severity === 'info').length, 0
  );

  const parts = [
    `score=${result.score.overall}/10`,
    `errors=${errors}`,
    `warnings=${warnings}`,
    `info=${infos}`,
    `components=${result.componentCount}`,
    `format=${result.format}`
  ];

  if (result.compliance) {
    parts.push(`ntia=${result.compliance.compliant ? 'pass' : 'fail'}`);
  }

  return parts.join(' ');
}

module.exports = { formatResult };
