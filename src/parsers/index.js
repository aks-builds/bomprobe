const { detectFormat } = require('./detect');
const cyclonedx = require('./cyclonedx');
const spdx = require('./spdx');

function parse(filePath) {
  const detected = detectFormat(filePath);
  if (detected.error) return { error: detected.error };

  const normalizer = detected.format === 'cyclonedx' ? cyclonedx : spdx;
  return { sbom: normalizer.normalize(detected.doc) };
}

module.exports = { parse };
