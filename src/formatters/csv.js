function escapeField(value) {
  const str = String(value == null ? '' : value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function formatResult(result) {
  const lines = [];

  lines.push('severity,check,component,message');

  for (const check of result.checks) {
    for (const f of check.findings) {
      lines.push([
        escapeField(f.severity),
        escapeField(check.id || ''),
        escapeField(f.component),
        escapeField(f.message)
      ].join(','));
    }
  }

  return lines.join('\n');
}

module.exports = { formatResult };
