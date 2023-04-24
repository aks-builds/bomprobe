function validateStructure(sbom) {
  const errors = [];

  if (!sbom || typeof sbom !== 'object') {
    errors.push('Input is not a valid object');
    return { valid: false, errors };
  }

  const isCdx = sbom.bomFormat === 'CycloneDX' || sbom.specVersion;
  const isSpdx = !!sbom.spdxVersion;

  if (!isCdx && !isSpdx) {
    errors.push('Cannot detect SBOM format (no bomFormat/specVersion or spdxVersion)');
  }

  if (isCdx) {
    if (!sbom.specVersion) errors.push('CycloneDX: missing specVersion');
    if (!Array.isArray(sbom.components)) errors.push('CycloneDX: components must be an array');
    if (sbom.metadata && typeof sbom.metadata !== 'object') errors.push('CycloneDX: metadata must be an object');
    if (sbom.dependencies && !Array.isArray(sbom.dependencies)) errors.push('CycloneDX: dependencies must be an array');
  }

  if (isSpdx) {
    if (!sbom.SPDXID) errors.push('SPDX: missing SPDXID');
    if (!sbom.name) errors.push('SPDX: missing document name');
    if (sbom.packages && !Array.isArray(sbom.packages)) errors.push('SPDX: packages must be an array');
  }

  return { valid: errors.length === 0, errors, format: isCdx ? 'CycloneDX' : isSpdx ? 'SPDX' : 'unknown' };
}

module.exports = { validateStructure };
