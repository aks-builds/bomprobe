function filterComponents(sbom, predicate) {
  return sbom.components.filter(predicate);
}

function withoutLicense(sbom) {
  return filterComponents(sbom, c => !c.license);
}

function withoutPurl(sbom) {
  return filterComponents(sbom, c => !c.purl);
}

function withoutSupplier(sbom) {
  return filterComponents(sbom, c => !c.supplier);
}

function byType(sbom, type) {
  return filterComponents(sbom, c => c.type === type);
}

module.exports = { filterComponents, withoutLicense, withoutPurl, withoutSupplier, byType };
