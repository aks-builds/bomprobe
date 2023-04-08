function grade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function gradeLabel(letter) {
  const labels = {
    A: 'Excellent',
    B: 'Good',
    C: 'Acceptable',
    D: 'Poor',
    F: 'Failing'
  };
  return labels[letter] || 'Unknown';
}

function gradeWithLabel(score) {
  const letter = grade(score);
  return { letter, label: gradeLabel(letter), score };
}

module.exports = { grade, gradeLabel, gradeWithLabel };
