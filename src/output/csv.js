function formatCsv(result) {
  const rows = [];
  rows.push('check,severity,component,message');

  for (const r of (result.results || [])) {
    for (const f of r.findings) {
      const check = escape(r.name || r.id);
      const sev = escape(f.severity || 'info');
      const comp = escape(f.component || '');
      const msg = escape(f.message || '');
      rows.push(`${check},${sev},${comp},${msg}`);
    }
  }

  return rows.join('\n');
}

function escape(value) {
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

module.exports = { formatCsv };
