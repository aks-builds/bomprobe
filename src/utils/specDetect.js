function detectFormat(doc) {
  if (doc.bomFormat === 'CycloneDX') return { format: 'cyclonedx', version: doc.specVersion };
  if (doc.spdxVersion) {
    const match = doc.spdxVersion.match(/SPDX-(\d+\.\d+)/);
    return { format: 'spdx', version: match ? match[1] : 'unknown' };
  }
  if (doc.bomFormat) return { format: 'unknown-bom', version: null };
  return { format: 'unknown', version: null };
}

function isMinimumVersion(detected, minVersion) {
  if (!detected.version || detected.version === 'unknown') return false;
  const [major, minor] = detected.version.split('.').map(Number);
  const [minMajor, minMinor] = minVersion.split('.').map(Number);
  if (major > minMajor) return true;
  if (major === minMajor) return minor >= minMinor;
  return false;
}

module.exports = { detectFormat, isMinimumVersion };
