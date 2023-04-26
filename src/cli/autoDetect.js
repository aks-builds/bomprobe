const { readFileSync, existsSync } = require('node:fs');
const { join, basename } = require('node:path');

const SBOM_PATTERNS = [
  'bom.json', 'sbom.json', 'cyclonedx.json',
  'bom.xml', 'sbom.xml', 'cyclonedx.xml',
  'spdx.json', 'spdx.spdx', 'spdx.tv'
];

function detectSbomFiles(dir) {
  const found = [];
  for (const pattern of SBOM_PATTERNS) {
    const path = join(dir, pattern);
    if (existsSync(path)) {
      found.push({ path, name: pattern, format: detectFormat(path) });
    }
  }
  return found;
}

function detectFormat(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8').trim();
    if (content.startsWith('{')) {
      const parsed = JSON.parse(content);
      if (parsed.bomFormat === 'CycloneDX') return 'cyclonedx-json';
      if (parsed.spdxVersion) return 'spdx-json';
      return 'json-unknown';
    }
    if (content.startsWith('<?xml') || content.startsWith('<bom')) return 'cyclonedx-xml';
    if (content.startsWith('SPDXVersion:')) return 'spdx-tv';
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

function detectFromContent(content) {
  if (typeof content === 'string') {
    try { content = JSON.parse(content); } catch { return 'unknown'; }
  }
  if (content.bomFormat === 'CycloneDX') return 'cyclonedx';
  if (content.spdxVersion) return 'spdx';
  return 'unknown';
}

module.exports = { detectSbomFiles, detectFormat, detectFromContent, SBOM_PATTERNS };
