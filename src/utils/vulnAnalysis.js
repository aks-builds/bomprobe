const KNOWN_SOURCES = new Set([
  'NVD', 'GHSA', 'OSV', 'SNYK', 'CVE',
  'VULNDB', 'CERTCC', 'CISA', 'npm'
]);

function analyzeVulnerabilities(vulnerabilities) {
  if (!vulnerabilities || vulnerabilities.length === 0) {
    return { total: 0, bySeverity: {}, bySource: {}, withRating: 0, withoutRating: 0 };
  }

  const bySeverity = {};
  const bySource = {};
  let withRating = 0;
  let withoutRating = 0;

  for (const vuln of vulnerabilities) {
    const ratings = vuln.ratings || [];
    if (ratings.length > 0) {
      withRating++;
      for (const r of ratings) {
        const sev = (r.severity || 'unknown').toLowerCase();
        bySeverity[sev] = (bySeverity[sev] || 0) + 1;
      }
    } else {
      withoutRating++;
    }

    const source = vuln.source?.name || vuln.source?.url || 'unknown';
    bySource[source] = (bySource[source] || 0) + 1;
  }

  return {
    total: vulnerabilities.length,
    bySeverity,
    bySource,
    withRating,
    withoutRating
  };
}

function highSeverityCount(vulnerabilities) {
  if (!vulnerabilities) return 0;
  return vulnerabilities.filter(v => {
    const ratings = v.ratings || [];
    return ratings.some(r => {
      const sev = (r.severity || '').toLowerCase();
      return sev === 'critical' || sev === 'high';
    });
  }).length;
}

module.exports = { analyzeVulnerabilities, highSeverityCount, KNOWN_SOURCES };
