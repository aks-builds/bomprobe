const { readFileSync, writeFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');

function loadHistory(filePath) {
  if (!existsSync(filePath)) return [];
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

function saveHistory(filePath, history) {
  writeFileSync(filePath, JSON.stringify(history, null, 2));
}

function addEntry(history, entry) {
  const record = {
    timestamp: new Date().toISOString(),
    score: entry.score,
    grade: entry.grade,
    findings: entry.findings,
    checks: entry.checks,
    components: entry.components,
    format: entry.format,
    specVersion: entry.specVersion
  };
  history.push(record);
  return history;
}

function computeTrend(history) {
  if (history.length < 2) return { direction: 'stable', delta: 0, entries: history.length };

  const recent = history.slice(-10);
  const first = recent[0].score;
  const last = recent[recent.length - 1].score;
  const delta = Math.round((last - first) * 10) / 10;

  let direction = 'stable';
  if (delta > 0.5) direction = 'improving';
  else if (delta < -0.5) direction = 'declining';

  const scores = recent.map(e => e.score);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10;
  const min = Math.min(...scores);
  const max = Math.max(...scores);

  return {
    direction,
    delta,
    entries: history.length,
    recent: {
      count: recent.length,
      avg,
      min,
      max,
      first,
      last
    }
  };
}

function formatTrend(trend) {
  const lines = [];
  const arrow = trend.direction === 'improving' ? '^' :
    trend.direction === 'declining' ? 'v' : '-';

  lines.push('SBOM Quality Trend');
  lines.push('==================');
  lines.push(`Direction: ${trend.direction} (${arrow})`);
  lines.push(`Delta: ${trend.delta > 0 ? '+' : ''}${trend.delta}`);
  lines.push(`Total entries: ${trend.entries}`);

  if (trend.recent) {
    lines.push('');
    lines.push(`Last ${trend.recent.count} audits:`);
    lines.push(`  Average: ${trend.recent.avg}/10`);
    lines.push(`  Range:   ${trend.recent.min} - ${trend.recent.max}`);
    lines.push(`  First:   ${trend.recent.first}/10`);
    lines.push(`  Latest:  ${trend.recent.last}/10`);
  }

  return lines.join('\n');
}

module.exports = { loadHistory, saveHistory, addEntry, computeTrend, formatTrend };
