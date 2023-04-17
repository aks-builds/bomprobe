const { analyzeHashes } = require('../utils/hashVerify');
const { classifyComponents } = require('../utils/licenseClassify');
const { summarizeTypes } = require('../utils/componentTypeSummary');
const { analyzeScopes } = require('../utils/scopeAnalysis');
const { analyzeExternalRefs } = require('../utils/externalRefAnalysis');

function collectStats(sbom) {
  const components = sbom.components || [];
  const meta = sbom.metadata || {};

  return {
    format: sbom.format || (sbom.bomFormat === 'CycloneDX' ? 'cyclonedx' : 'unknown'),
    specVersion: sbom.specVersion || sbom.spdxVersion || null,
    componentCount: components.length,
    hasMetadata: Object.keys(meta).length > 0,
    hasTimestamp: !!meta.timestamp,
    hasTools: !!(meta.tools && meta.tools.length > 0),
    hasDependencies: !!(sbom.dependencies && sbom.dependencies.length > 0),
    types: summarizeTypes(components),
    scopes: analyzeScopes(components),
    hashes: analyzeHashes(components),
    licenses: classifyComponents(components),
    externalRefs: analyzeExternalRefs(components),
    coverage: calculateCoverage(components)
  };
}

function calculateCoverage(components) {
  if (components.length === 0) return { purl: 0, license: 0, hash: 0, supplier: 0, version: 0 };

  let purl = 0, license = 0, hash = 0, supplier = 0, version = 0;
  for (const c of components) {
    if (c.purl) purl++;
    if (c.licenses?.length > 0 || c.license) license++;
    if (c.hashes?.length > 0) hash++;
    if (c.supplier || c.author || c.publisher) supplier++;
    if (c.version) version++;
  }

  const total = components.length;
  return {
    purl: Math.round((purl / total) * 100),
    license: Math.round((license / total) * 100),
    hash: Math.round((hash / total) * 100),
    supplier: Math.round((supplier / total) * 100),
    version: Math.round((version / total) * 100)
  };
}

module.exports = { collectStats };
