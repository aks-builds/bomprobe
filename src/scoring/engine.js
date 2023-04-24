const GRADE_THRESHOLDS = [
  { grade: 'A', min: 90 },
  { grade: 'B', min: 80 },
  { grade: 'C', min: 70 },
  { grade: 'D', min: 60 },
  { grade: 'F', min: 0 }
];

function calculateScore(results, options = {}) {
  const weights = options.weights || {};
  let totalWeight = 0;
  let weightedScore = 0;

  for (const r of results) {
    const w = weights[r.id] || r.weight || 1;
    totalWeight += w;

    const findingPenalty = computePenalty(r.findings);
    const checkScore = Math.max(0, 100 - findingPenalty);
    weightedScore += checkScore * w;
  }

  const overall = totalWeight === 0 ? 100 : Math.round(weightedScore / totalWeight);
  return {
    overall,
    grade: assignGrade(overall),
    checkCount: results.length,
    findingCount: results.reduce((sum, r) => sum + r.findings.length, 0)
  };
}

function computePenalty(findings) {
  let penalty = 0;
  for (const f of findings) {
    if (f.severity === 'error') penalty += 25;
    else if (f.severity === 'warning') penalty += 10;
    else penalty += 3;
  }
  return penalty;
}

function assignGrade(score) {
  for (const t of GRADE_THRESHOLDS) {
    if (score >= t.min) return t.grade;
  }
  return 'F';
}

module.exports = { calculateScore, assignGrade, computePenalty, GRADE_THRESHOLDS };
