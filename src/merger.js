const { parse } = require('./parsers');
const { runAll } = require('./checks');
const { scoreSbom } = require('./scorer');
const { getProfile } = require('./profiles');

function audit(filePath, options = {}) {
  const parsed = parse(filePath);
  if (parsed.error) return { error: parsed.error };

  const sbom = parsed.sbom;
  const checkResults = runAll(sbom, { exclude: options.exclude, only: options.only });
  const score = scoreSbom(sbom);

  const result = { file: filePath, format: sbom.format, score, checks: checkResults, componentCount: sbom.components.length };
  if (options.profile) {
    const profile = getProfile(options.profile);
    if (profile) result.compliance = profile.evaluate(checkResults);
  }
  return result;
}

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
