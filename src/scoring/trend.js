function compareScorecards(before, after) {
  const result = {
    scoreDelta: (after.overall ?? 0) - (before.overall ?? 0),
    gradeBefore: before.grade || 'N/A',
    gradeAfter: after.grade || 'N/A',
    improved: [],
    regressed: [],
    unchanged: []
  };

  const allCategories = new Set([
    ...Object.keys(before.categories || {}),
    ...Object.keys(after.categories || {})
  ]);

  for (const cat of allCategories) {
    const bScore = before.categories?.[cat] ?? 0;
    const aScore = after.categories?.[cat] ?? 0;
    const delta = aScore - bScore;

    if (delta > 0) result.improved.push({ category: cat, delta, before: bScore, after: aScore });
    else if (delta < 0) result.regressed.push({ category: cat, delta, before: bScore, after: aScore });
    else result.unchanged.push({ category: cat, score: aScore });
  }

  return result;
}

function formatTrendText(comparison) {
  const lines = [`Score: ${comparison.gradeBefore} -> ${comparison.gradeAfter} (${comparison.scoreDelta >= 0 ? '+' : ''}${comparison.scoreDelta})`];

  if (comparison.improved.length) {
    lines.push('Improved:');
    for (const c of comparison.improved) lines.push(`  + ${c.category}: ${c.before} -> ${c.after} (+${c.delta})`);
  }
  if (comparison.regressed.length) {
    lines.push('Regressed:');
    for (const c of comparison.regressed) lines.push(`  - ${c.category}: ${c.before} -> ${c.after} (${c.delta})`);
  }

  return lines.join('\n');
}

module.exports = { compareScorecards, formatTrendText };
