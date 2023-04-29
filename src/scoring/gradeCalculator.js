function calculateGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function gradeDescription(grade) {
  const descriptions = {
    A: 'Excellent - SBOM meets highest quality standards',
    B: 'Good - minor improvements recommended',
    C: 'Fair - several quality gaps detected',
    D: 'Poor - significant quality issues',
    F: 'Failing - critical quality problems'
  };
  return descriptions[grade] || 'Unknown grade';
}

function formatGradeReport(score) {
  const grade = calculateGrade(score);
  return {
    score,
    grade,
    description: gradeDescription(grade),
    passingGrade: score >= 60,
    nextGrade: score < 90 ? calculateGrade(score + 10) : null,
    pointsToNext: score < 90
      ? (Math.ceil(score / 10) * 10) - score
      : 0
  };
}

module.exports = { calculateGrade, gradeDescription, formatGradeReport };
