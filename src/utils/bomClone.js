function deepClone(sbom) {
  return JSON.parse(JSON.stringify(sbom));
}

function cloneWithoutComponents(sbom) {
  const clone = deepClone(sbom);
  delete clone.components;
  return clone;
}

function cloneWithSubset(sbom, componentNames) {
  const nameSet = new Set(componentNames);
  const clone = deepClone(sbom);
  clone.components = (clone.components || []).filter(c => nameSet.has(c.name));
  return clone;
}

function cloneMetadataOnly(sbom) {
  return {
    bomFormat: sbom.bomFormat,
    specVersion: sbom.specVersion,
    version: sbom.version,
    metadata: sbom.metadata ? deepClone(sbom.metadata) : undefined
  };
}

module.exports = { deepClone, cloneWithoutComponents, cloneWithSubset, cloneMetadataOnly };
