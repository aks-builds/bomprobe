function analyzeStats(sbom) {
  const components = sbom.components || [];
  const deps = sbom.dependencies || [];

  const typeCount = {};
  const scopeCount = {};
  const licenseCount = {};
  const supplierCount = {};
  let withPurl = 0;
  let withHash = 0;
  let withLicense = 0;
  let withSupplier = 0;
  let withDescription = 0;
  let withVersion = 0;

  for (const c of components) {
    const type = c.type || 'unknown';
    typeCount[type] = (typeCount[type] || 0) + 1;

    const scope = c.scope || 'unspecified';
    scopeCount[scope] = (scopeCount[scope] || 0) + 1;

    if (c.purl) withPurl++;
    if (Array.isArray(c.hashes) && c.hashes.length > 0) withHash++;
    if (c.version) withVersion++;
    if (c.description) withDescription++;

    const lics = extractLicenses(c);
    if (lics.length > 0) {
      withLicense++;
      for (const l of lics) licenseCount[l] = (licenseCount[l] || 0) + 1;
    }

    const sup = c.supplier?.name || c.author;
    if (sup) {
      withSupplier++;
      supplierCount[sup] = (supplierCount[sup] || 0) + 1;
    }
  }

  const total = components.length;
  return {
    total,
    types: typeCount,
    scopes: scopeCount,
    licenses: licenseCount,
    suppliers: sortedTop(supplierCount, 10),
    coverage: {
      purl: pct(withPurl, total),
      hash: pct(withHash, total),
      license: pct(withLicense, total),
      supplier: pct(withSupplier, total),
      description: pct(withDescription, total),
      version: pct(withVersion, total)
    },
    dependencies: {
      declared: deps.length,
      avgDepsPerComponent: deps.length > 0
        ? Math.round(deps.reduce((s, d) => s + (d.dependsOn || []).length, 0) / deps.length * 10) / 10
        : 0
    },
    metadata: {
      hasTimestamp: !!(sbom.metadata?.timestamp),
      hasTools: Array.isArray(sbom.metadata?.tools) && sbom.metadata.tools.length > 0,
      specVersion: sbom.specVersion || 'unknown',
      format: sbom.bomFormat || sbom.spdxVersion || 'unknown'
    }
  };
}

function extractLicenses(component) {
  const lics = [];
  if (Array.isArray(component.licenses)) {
    for (const l of component.licenses) {
      if (l.license?.id) lics.push(l.license.id);
      else if (l.expression) lics.push(l.expression);
    }
  }
  return lics;
}

function pct(n, total) {
  if (total === 0) return 0;
  return Math.round((n / total) * 1000) / 10;
}

function sortedTop(obj, n) {
  return Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .reduce((m, [k, v]) => { m[k] = v; return m; }, {});
}

function formatStats(stats) {
  const lines = [];
  lines.push(`SBOM Statistics`);
  lines.push(`===============`);
  lines.push(`Total components: ${stats.total}`);
  lines.push(`Format: ${stats.metadata.format} ${stats.metadata.specVersion}`);
  lines.push('');

  lines.push('Component types:');
  for (const [t, c] of Object.entries(stats.types)) lines.push(`  ${t}: ${c}`);
  lines.push('');

  lines.push('Field coverage:');
  for (const [f, p] of Object.entries(stats.coverage)) lines.push(`  ${f}: ${p}%`);
  lines.push('');

  lines.push(`Top licenses:`);
  for (const [l, c] of Object.entries(stats.licenses).slice(0, 10)) lines.push(`  ${l}: ${c}`);
  lines.push('');

  lines.push(`Top suppliers:`);
  for (const [s, c] of Object.entries(stats.suppliers)) lines.push(`  ${s}: ${c}`);

  return lines.join('\n');
}

module.exports = { analyzeStats, formatStats, extractLicenses };
