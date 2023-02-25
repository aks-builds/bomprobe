const { parse } = require('./parsers');
const { runAll } = require('./checks');
const { scoreSbom } = require('./scorer');
const { evaluate: evaluateNtia } = require('./profiles/ntia');
const { evaluate: evaluateBsi } = require('./profiles/bsi');

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

  if (options.profile === 'ntia') {
    result.compliance = evaluateNtia(checkResults);
  } else if (options.profile === 'bsi') {
    result.compliance = evaluateBsi(checkResults);
  }

  return result;
}

module.exports = { audit };
