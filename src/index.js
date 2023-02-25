const { parse } = require('./parsers');
const { runAll } = require('./checks');
const { scoreSbom } = require('./scorer');
const { getProfile } = require('./profiles');

function audit(filePath, options = {}) {
  const parsed = parse(filePath);
  if (parsed.error) return { error: parsed.error };

  const sbom = parsed.sbom;
  const checkResults = runAll(sbom, { exclude: options.exclude });
  const score = scoreSbom(sbom);

  const result = {
    file: filePath,
    format: sbom.format,
    score,
    checks: checkResults,
    componentCount: sbom.components.length
  };

  if (options.profile) {
    const profile = getProfile(options.profile);
    if (profile) {
      result.compliance = profile.evaluate(checkResults);
    }
  }

  return result;
}

module.exports = { audit };
