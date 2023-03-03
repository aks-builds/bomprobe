function componentStats(sbom) {
  const total = sbom.components.length;
  if (total === 0) return { total: 0, withLicense: 0, withPurl: 0, withHashes: 0, withSupplier: 0 };

  let withLicense = 0;
  let withPurl = 0;
  let withHashes = 0;
  let withSupplier = 0;

  for (const c of sbom.components) {
    if (c.license) withLicense++;
    if (c.purl) withPurl++;
    if (c.hashes > 0) withHashes++;
    if (c.supplier) withSupplier++;
  }

  return {
    total,
    withLicense,
    withPurl,
    withHashes,
    withSupplier,
    licenseCoverage: withLicense / total,
    purlCoverage: withPurl / total,
    hashCoverage: withHashes / total,
    supplierCoverage: withSupplier / total
  };
}

module.exports = { componentStats };
