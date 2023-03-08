const { audit } = require('./index');

function merge(files, options = {}) {
  const results = [];
  let totalScore = 0;
  let totalComponents = 0;

  for (const file of files) {
    const result = audit(file, options);
    if (result.error) {
      results.push({ file, error: result.error });
      continue;
    }
    results.push(result);
    totalScore += result.score.overall;
    totalComponents += result.componentCount;
  }

  const validResults = results.filter(r => !r.error);
  const averageScore = validResults.length > 0 ? totalScore / validResults.length : 0;

  return {
    files: results,
    summary: {
      total: files.length,
      valid: validResults.length,
      errors: files.length - validResults.length,
      averageScore: Math.round(averageScore * 10) / 10,
      totalComponents
    }
  };
}

module.exports = { merge };
