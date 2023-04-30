const { readFileSync, writeFileSync, existsSync } = require('node:fs');

function loadBaseline(filePath) {
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function saveBaseline(filePath, auditResult) {
  const baseline = {
    version: 1,
    created: new Date().toISOString(),
    score: auditResult.score,
    grade: auditResult.grade,
    checkCount: auditResult.checkCount,
    componentCount: auditResult.componentCount,
    findings: (auditResult.findings || []).map(f => ({
      checkId: f.checkId,
      severity: f.severity,
      message: f.message,
      component: f.component || null
    })),
    suppressions: []
  };
  writeFileSync(filePath, JSON.stringify(baseline, null, 2));
  return baseline;
}

function compareToBaseline(baseline, current) {
  if (!baseline) return { status: 'no-baseline', newFindings: [], resolvedFindings: [], regressions: [] };

  const baseKeys = new Set(baseline.findings.map(f => `${f.checkId}:${f.component || ''}:${f.message}`));
  const currFindings = (current.findings || []).map(f => ({
    checkId: f.checkId,
    severity: f.severity,
    message: f.message,
    component: f.component || null
  }));
  const currKeys = new Set(currFindings.map(f => `${f.checkId}:${f.component || ''}:${f.message}`));

  const newFindings = currFindings.filter(f => !baseKeys.has(`${f.checkId}:${f.component || ''}:${f.message}`));
  const resolvedFindings = baseline.findings.filter(f => !currKeys.has(`${f.checkId}:${f.component || ''}:${f.message}`));

  const scoreDelta = (current.score || 0) - (baseline.score || 0);
  const regressions = [];
  if (scoreDelta < -5) regressions.push({ type: 'score-drop', delta: scoreDelta });
  if (newFindings.some(f => f.severity === 'error')) regressions.push({ type: 'new-errors', count: newFindings.filter(f => f.severity === 'error').length });

  return {
    status: regressions.length > 0 ? 'regressed' : newFindings.length > 0 ? 'changed' : 'stable',
    scoreDelta,
    newFindings,
    resolvedFindings,
    regressions
  };
}

function addSuppression(baseline, finding, reason) {
  if (!baseline.suppressions) baseline.suppressions = [];
  baseline.suppressions.push({
    checkId: finding.checkId,
    component: finding.component || null,
    message: finding.message,
    reason,
    suppressedAt: new Date().toISOString()
  });
  return baseline;
}

function applySuppression(findings, baseline) {
  if (!baseline || !baseline.suppressions || baseline.suppressions.length === 0) return findings;
  const suppKeys = new Set(baseline.suppressions.map(s => `${s.checkId}:${s.component || ''}:${s.message}`));
  return findings.filter(f => !suppKeys.has(`${f.checkId}:${f.component || ''}:${f.message}`));
}

function formatComparison(comparison) {
  const lines = [];
  lines.push('Baseline Comparison');
  lines.push('===================');
  lines.push(`Status: ${comparison.status}`);

  if (comparison.scoreDelta !== undefined) {
    const sign = comparison.scoreDelta > 0 ? '+' : '';
    lines.push(`Score delta: ${sign}${Math.round(comparison.scoreDelta * 10) / 10}`);
  }

  if (comparison.newFindings.length > 0) {
    lines.push(`\nNew findings (${comparison.newFindings.length}):`);
    for (const f of comparison.newFindings) {
      lines.push(`  [${f.severity}] ${f.checkId}: ${f.message}`);
    }
  }

  if (comparison.resolvedFindings.length > 0) {
    lines.push(`\nResolved findings (${comparison.resolvedFindings.length}):`);
    for (const f of comparison.resolvedFindings) {
      lines.push(`  [${f.severity}] ${f.checkId}: ${f.message}`);
    }
  }

  if (comparison.regressions.length > 0) {
    lines.push('\nRegressions:');
    for (const r of comparison.regressions) {
      if (r.type === 'score-drop') lines.push(`  Score dropped by ${Math.abs(r.delta)} points`);
      if (r.type === 'new-errors') lines.push(`  ${r.count} new error-level findings`);
    }
  }

  return lines.join('\n');
}

module.exports = { loadBaseline, saveBaseline, compareToBaseline, addSuppression, applySuppression, formatComparison };
