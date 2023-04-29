function formatTrendReport(snapshots) {
  if (!snapshots || snapshots.length === 0) return 'No snapshots available for trend analysis.';

  const lines = ['# SBOM Quality Trend Report', ''];
  lines.push(`Total snapshots: ${snapshots.length}`);
  lines.push('');

  const latest = snapshots[snapshots.length - 1];
  const first = snapshots[0];

  if (latest.score !== undefined && first.score !== undefined) {
    const delta = latest.score - first.score;
    const direction = delta > 0 ? 'improved' : delta < 0 ? 'declined' : 'unchanged';
    lines.push(`Score trend: ${first.score} -> ${latest.score} (${direction})`);
  }

  lines.push('');
  lines.push('| Snapshot | Score | Components | Findings |');
  lines.push('|----------|-------|------------|----------|');

  for (const s of snapshots) {
    const date = s.timestamp || 'unknown';
    const score = s.score !== undefined ? String(s.score) : '-';
    const comps = s.componentCount !== undefined ? String(s.componentCount) : '-';
    const findings = s.findingCount !== undefined ? String(s.findingCount) : '-';
    lines.push(`| ${date} | ${score} | ${comps} | ${findings} |`);
  }

  return lines.join('\n');
}

function formatTrendJson(snapshots) {
  if (!snapshots || snapshots.length === 0) return { trend: 'no_data', snapshots: [] };

  const latest = snapshots[snapshots.length - 1];
  const first = snapshots[0];

  let direction = 'unchanged';
  if (latest.score !== undefined && first.score !== undefined) {
    if (latest.score > first.score) direction = 'improved';
    else if (latest.score < first.score) direction = 'declined';
  }

  return {
    trend: direction,
    count: snapshots.length,
    latest: latest,
    first: first,
    snapshots
  };
}

module.exports = { formatTrendReport, formatTrendJson };
