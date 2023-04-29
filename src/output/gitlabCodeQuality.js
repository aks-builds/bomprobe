function formatCodeQuality(results, bomFile = 'sbom.json') {
  const issues = [];

  for (const r of results) {
    for (const f of (r.findings || [])) {
      issues.push({
        type: 'issue',
        check_name: r.id,
        description: f.message || `${r.name} check failed`,
        severity: mapSeverity(f.severity),
        categories: ['Security'],
        location: {
          path: bomFile,
          lines: { begin: 1 }
        },
        fingerprint: fingerprint(r.id, f.component || f.message)
      });
    }
  }

  return JSON.stringify(issues, null, 2);
}

function mapSeverity(sev) {
  if (sev === 'error') return 'critical';
  if (sev === 'warning') return 'major';
  return 'minor';
}

function fingerprint(checkId, detail) {
  let hash = 0;
  const str = `${checkId}:${detail}`;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

module.exports = { formatCodeQuality };
