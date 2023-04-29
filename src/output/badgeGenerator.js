function generateBadgeUrl(label, value, color) {
  const l = encodeURIComponent(label);
  const v = encodeURIComponent(value);
  const c = encodeURIComponent(color);
  return `https://img.shields.io/badge/${l}-${v}-${c}`;
}

function scoreBadge(score) {
  let color = 'red';
  if (score >= 80) color = 'brightgreen';
  else if (score >= 60) color = 'green';
  else if (score >= 40) color = 'yellow';
  else if (score >= 20) color = 'orange';
  return generateBadgeUrl('bomprobe', `${score}%25`, color);
}

function gradeBadge(grade) {
  const colors = { A: 'brightgreen', B: 'green', C: 'yellow', D: 'orange', F: 'red' };
  return generateBadgeUrl('grade', grade, colors[grade] || 'lightgrey');
}

function formatBadgeMarkdown(score, grade) {
  const scoreUrl = scoreBadge(score);
  const gradeUrl = gradeBadge(grade);
  return `![bomprobe score](${scoreUrl}) ![bomprobe grade](${gradeUrl})`;
}

module.exports = { generateBadgeUrl, scoreBadge, gradeBadge, formatBadgeMarkdown };
