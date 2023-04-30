function extractVulnerabilities(sbom) {
  const vulns = [];

  if (!sbom || typeof sbom !== 'object') return vulns;

  const components = Array.isArray(sbom.components) ? sbom.components : [];
  for (const comp of components) {
    if (!comp || typeof comp !== 'object') continue;

    if (Array.isArray(comp.vulnerabilities)) {
      for (const v of comp.vulnerabilities) {
        vulns.push({
          id: v.id || 'unknown',
          source: v.source?.name || 'unknown',
          severity: normalizeSeverity(v.ratings),
          component: comp.name || 'unknown',
          version: comp.version || 'unknown',
          purl: comp.purl || null,
          description: v.description || '',
          advisories: Array.isArray(v.advisories) ? v.advisories.map(a => a.url || a).filter(Boolean) : [],
          cwes: Array.isArray(v.cwes) ? v.cwes.map(c => typeof c === 'object' ? c.cweId : c) : []
        });
      }
    }
  }

  if (Array.isArray(sbom.vulnerabilities)) {
    for (const v of sbom.vulnerabilities) {
      if (!v || typeof v !== 'object') continue;
      const affects = Array.isArray(v.affects) ? v.affects : [];
      for (const a of affects) {
        const comp = components.find(c => c['bom-ref'] === a.ref) || {};
        vulns.push({
          id: v.id || 'unknown',
          source: v.source?.name || 'unknown',
          severity: normalizeSeverity(v.ratings),
          component: comp.name || a.ref || 'unknown',
          version: comp.version || 'unknown',
          purl: comp.purl || null,
          description: v.description || '',
          advisories: Array.isArray(v.advisories) ? v.advisories.map(a2 => a2.url || a2).filter(Boolean) : [],
          cwes: Array.isArray(v.cwes) ? v.cwes.map(c => typeof c === 'object' ? c.cweId : c) : []
        });
      }
      if (affects.length === 0) {
        vulns.push({
          id: v.id || 'unknown',
          source: v.source?.name || 'unknown',
          severity: normalizeSeverity(v.ratings),
          component: 'unattributed',
          version: 'unknown',
          purl: null,
          description: v.description || '',
          advisories: [],
          cwes: []
        });
      }
    }
  }

  return vulns;
}

function normalizeSeverity(ratings) {
  if (!Array.isArray(ratings) || ratings.length === 0) return 'unknown';
  const r = ratings[0];
  if (r.severity) return r.severity.toLowerCase();
  if (typeof r.score === 'number') {
    if (r.score >= 9.0) return 'critical';
    if (r.score >= 7.0) return 'high';
    if (r.score >= 4.0) return 'medium';
    if (r.score > 0) return 'low';
    return 'none';
  }
  return 'unknown';
}

function correlateWithQuality(vulns, qualityFindings) {
  const compVulnMap = new Map();
  for (const v of vulns) {
    const key = `${v.component}@${v.version}`;
    if (!compVulnMap.has(key)) compVulnMap.set(key, []);
    compVulnMap.get(key).push(v);
  }

  const correlations = [];
  for (const [comp, compVulns] of compVulnMap) {
    const relatedFindings = qualityFindings.filter(f =>
      f.component && (f.component === comp || comp.startsWith(f.component + '@'))
    );

    correlations.push({
      component: comp,
      vulnCount: compVulns.length,
      maxSeverity: getMaxSeverity(compVulns.map(v => v.severity)),
      vulns: compVulns.map(v => ({ id: v.id, severity: v.severity })),
      qualityIssues: relatedFindings.length,
      riskScore: computeRiskScore(compVulns, relatedFindings)
    });
  }

  return correlations.sort((a, b) => b.riskScore - a.riskScore);
}

function getMaxSeverity(severities) {
  const order = { critical: 4, high: 3, medium: 2, low: 1, none: 0, unknown: -1 };
  let max = -1;
  let maxSev = 'unknown';
  for (const s of severities) {
    const val = order[s] ?? -1;
    if (val > max) { max = val; maxSev = s; }
  }
  return maxSev;
}

function computeRiskScore(vulns, qualityFindings) {
  const sevWeights = { critical: 10, high: 7, medium: 4, low: 1, none: 0, unknown: 2 };
  let score = 0;
  for (const v of vulns) {
    score += sevWeights[v.severity] ?? 2;
  }
  score += qualityFindings.length * 1.5;
  return Math.round(score * 10) / 10;
}

function summarizeVulns(vulns) {
  const bySeverity = { critical: 0, high: 0, medium: 0, low: 0, none: 0, unknown: 0 };
  const bySource = {};
  const uniqueIds = new Set();

  for (const v of vulns) {
    bySeverity[v.severity] = (bySeverity[v.severity] || 0) + 1;
    bySource[v.source] = (bySource[v.source] || 0) + 1;
    uniqueIds.add(v.id);
  }

  return {
    total: vulns.length,
    unique: uniqueIds.size,
    bySeverity,
    bySource,
    affectedComponents: new Set(vulns.map(v => v.component)).size
  };
}

function formatVulnReport(vulns, correlations) {
  const summary = summarizeVulns(vulns);
  const lines = [];

  lines.push('Vulnerability Correlation Report');
  lines.push('================================');
  lines.push(`Total: ${summary.total} vulns (${summary.unique} unique) across ${summary.affectedComponents} components`);
  lines.push(`Critical: ${summary.bySeverity.critical}  High: ${summary.bySeverity.high}  Medium: ${summary.bySeverity.medium}  Low: ${summary.bySeverity.low}`);

  if (correlations && correlations.length > 0) {
    lines.push('\nRisk-ranked components:');
    for (const c of correlations.slice(0, 20)) {
      lines.push(`  ${c.component} - ${c.vulnCount} vulns (max: ${c.maxSeverity}), ${c.qualityIssues} quality issues, risk: ${c.riskScore}`);
    }
  }

  return lines.join('\n');
}

module.exports = { extractVulnerabilities, correlateWithQuality, summarizeVulns, formatVulnReport, normalizeSeverity, getMaxSeverity };
