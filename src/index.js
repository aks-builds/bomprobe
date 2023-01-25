const { parse } = require('./parsers');
const { runAll } = require('./checks');
const { scoreSbom } = require('./scorer');
const { evaluate: evaluateNtia } = require('./profiles/ntia');

function audit(filePath, options = {}) {
  const parsed = parse(filePath);
  if (parsed.error) return { error: parsed.error };

  const sbom = parsed.sbom;
  const checkResults = runAll(sbom);
  const score = scoreSbom(sbom);

  const result = {
    file: filePath,
    format: sbom.format,
    score,
    checks: checkResults,
    componentCount: sbom.components.length
  };

  if (options.profile === 'ntia') {
    result.compliance = evaluateNtia(checkResults);
  }

  return result;
}

module.exports = { audit };
