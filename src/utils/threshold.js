function checkThreshold(value, threshold, direction = 'min') {
  if (direction === 'min') return value >= threshold;
  return value <= threshold;
}

function evaluateThresholds(result, thresholds) {
  const failures = [];

  if (thresholds.score != null) {
    if (!checkThreshold(result.score.overall, thresholds.score)) {
      failures.push({ field: 'score', value: result.score.overall, threshold: thresholds.score });
    }
  }

  if (thresholds.componentScore != null) {
    if (!checkThreshold(result.score.components.average, thresholds.componentScore)) {
      failures.push({ field: 'componentScore', value: result.score.components.average, threshold: thresholds.componentScore });
    }
  }

  if (thresholds.metadataScore != null) {
    if (!checkThreshold(result.score.metadata, thresholds.metadataScore)) {
      failures.push({ field: 'metadataScore', value: result.score.metadata, threshold: thresholds.metadataScore });
    }
  }

  return { passed: failures.length === 0, failures };
}

module.exports = { checkThreshold, evaluateThresholds };
