function correlateVex(sbom, vexDocument) {
  const components = sbom.components || [];
  const statements = vexDocument.statements || [];

  const vulnMap = new Map();
  for (const stmt of statements) {
    const products = stmt.products || [];
    for (const product of products) {
      const id = product.purl || product.name;
      if (id) {
        if (!vulnMap.has(id)) vulnMap.set(id, []);
        vulnMap.get(id).push({
          vulnerability: stmt.vulnerability?.name || stmt.vulnerability?.id || 'unknown',
          status: stmt.status || 'unknown',
          justification: stmt.justification,
          impact: stmt.impact_statement
        });
      }
    }
  }

  const results = [];
  for (const c of components) {
    const key = c.purl || c.name;
    const vulns = vulnMap.get(key) || [];
    if (vulns.length > 0) {
      results.push({
        component: c.name,
        version: c.version,
        purl: c.purl,
        vulnerabilities: vulns
      });
    }
  }

  return {
    totalComponents: components.length,
    totalStatements: statements.length,
    affected: results.filter(r => r.vulnerabilities.some(v => v.status === 'affected')),
    notAffected: results.filter(r => r.vulnerabilities.every(v => v.status === 'not_affected')),
    underInvestigation: results.filter(r => r.vulnerabilities.some(v => v.status === 'under_investigation')),
    all: results
  };
}

function formatVexReport(correlation) {
  const lines = [];
  lines.push(`VEX Correlation: ${correlation.totalStatements} statements against ${correlation.totalComponents} components`);
  lines.push('');

  if (correlation.affected.length > 0) {
    lines.push(`AFFECTED (${correlation.affected.length}):`);
    for (const r of correlation.affected) {
      for (const v of r.vulnerabilities.filter(v => v.status === 'affected')) {
        lines.push(`  ${r.component}@${r.version} - ${v.vulnerability}`);
        if (v.impact) lines.push(`    Impact: ${v.impact}`);
      }
    }
    lines.push('');
  }

  if (correlation.notAffected.length > 0) {
    lines.push(`NOT AFFECTED (${correlation.notAffected.length}):`);
    for (const r of correlation.notAffected) {
      for (const v of r.vulnerabilities) {
        lines.push(`  ${r.component}@${r.version} - ${v.vulnerability} (${v.justification || 'no reason given'})`);
      }
    }
    lines.push('');
  }

  if (correlation.underInvestigation.length > 0) {
    lines.push(`UNDER INVESTIGATION (${correlation.underInvestigation.length}):`);
    for (const r of correlation.underInvestigation) {
      lines.push(`  ${r.component}@${r.version}`);
    }
  }

  return lines.join('\n');
}

module.exports = { correlateVex, formatVexReport };
