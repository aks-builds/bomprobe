const { readFileSync } = require('node:fs');

function detectFormat(filePath) {
  let raw;
  try {
    raw = readFileSync(filePath, 'utf8');
  } catch (err) {
    return { error: `Cannot read file: ${err.message}` };
  }

  if (!raw || raw.trim().length === 0) {
    return { error: 'Input file is empty: contains no data' };
  }

  const trimmed = raw.trim();

  if (
    trimmed.startsWith('<') &&
    (
      /SpdxDocument/i.test(trimmed) ||
      /<spdx[:\s>]/i.test(trimmed) ||
      /xmlns:[^=]*=["'][^"']*spdx/i.test(trimmed) ||
      /xmlns=["'][^"']*spdx/i.test(trimmed) ||
      (/<\?xml/i.test(trimmed) && /spdx/i.test(trimmed))
    )
  ) {
    return { error: 'SPDX XML format is not currently supported' };
  }

  let doc;
  try {
    doc = JSON.parse(raw);
  } catch {
    return { error: 'JSON file is incomplete or incorrectly formatted' };
  }

  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
    return { error: 'Valid JSON file does not contain a recognized SBOM format' };
  }

  if (doc.bomFormat === 'CycloneDX') {
    return { format: 'cyclonedx', version: doc.specVersion || 'unknown', doc };
  }

  if (doc.spdxVersion) {
    return { format: 'spdx', version: doc.spdxVersion, doc };
  }

  return { error: 'Valid JSON file does not contain a recognized SBOM format' };
}

module.exports = { detectFormat };
