function evaluateThreshold(score, threshold, failOn = 'error') {
  const belowThreshold = threshold !== undefined && score < threshold;

  return {
    score,
    threshold: threshold || null,
    failOn,
    passed: !belowThreshold,
    exitCode: belowThreshold ? 1 : 0,
    reason: belowThreshold
      ? `Score ${score} is below threshold ${threshold}`
      : null
  };
}

function evaluateFailOn(findings, failOn) {
  if (failOn === 'none') return { failed: false, trigger: null };

  const levels = { error: 3, warning: 2, info: 1 };
  const minLevel = levels[failOn] || 3;

  for (const f of findings) {
    const fLevel = levels[f.severity] || 0;
    if (fLevel >= minLevel) {
      return { failed: true, trigger: f.severity };
    }
  }

  return { failed: false, trigger: null };
}

module.exports = { evaluateThreshold, evaluateFailOn };
