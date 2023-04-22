function computeMetrics(sbom) {
  const components = sbom.components || [];
  const deps = sbom.dependencies || [];
  const total = components.length;

  if (total === 0) return emptyMetrics();

  let withPurl = 0;
  let withVersion = 0;
  let withLicense = 0;
  let withHash = 0;
  let withSupplier = 0;
  let withDescription = 0;

  for (const c of components) {
    if (c.purl) withPurl++;
    if (c.version) withVersion++;
    if (c.licenses?.length > 0 || c.license) withLicense++;
    if (c.hashes?.length > 0) withHash++;
    if (c.supplier?.name || c.author) withSupplier++;
    if (c.description) withDescription++;
  }

  return {
    componentCount: total,
    dependencyCount: deps.length,
    coverage: {
      purl: pct(withPurl, total),
      version: pct(withVersion, total),
      license: pct(withLicense, total),
      hash: pct(withHash, total),
      supplier: pct(withSupplier, total),
      description: pct(withDescription, total)
    },
    completenessScore: Math.round(
      (pct(withPurl, total) + pct(withVersion, total) + pct(withLicense, total) +
       pct(withHash, total) + pct(withSupplier, total)) / 5
    ),
    hasMetadata: !!sbom.metadata,
    hasTools: !!(sbom.metadata?.tools?.length > 0),
    hasDependencies: deps.length > 0,
    specVersion: sbom.specVersion || sbom.spdxVersion || null
  };
}

function pct(count, total) {
  return total === 0 ? 0 : Math.round((count / total) * 100);
}

function emptyMetrics() {
  return {
    componentCount: 0,
    dependencyCount: 0,
    coverage: { purl: 0, version: 0, license: 0, hash: 0, supplier: 0, description: 0 },
    completenessScore: 0,
    hasMetadata: false,
    hasTools: false,
    hasDependencies: false,
    specVersion: null
  };
}

module.exports = { computeMetrics };
