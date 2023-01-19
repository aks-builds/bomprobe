const { readFileSync } = require('node:fs');

function detectFormat(filePath) {
  let raw;
  try {
    raw = readFileSync(filePath, 'utf8');
  } catch (err) {
    return { error: `Cannot read file: ${err.message}` };
  }

  let doc;
  try {
    doc = JSON.parse(raw);
  } catch {
    return { error: 'File is not valid JSON' };
  }

  if (doc.bomFormat === 'CycloneDX') {
    return { format: 'cyclonedx', version: doc.specVersion || 'unknown', doc };
  }

  if (doc.spdxVersion) {
    return { format: 'spdx', version: doc.spdxVersion, doc };
  }

  return { error: 'Unknown SBOM format' };
}

module.exports = { detectFormat };
