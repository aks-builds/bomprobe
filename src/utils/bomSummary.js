function summarize(sbom) {
  const components = sbom.components || [];
  const deps = sbom.dependencies || [];
  const meta = sbom.metadata || {};

  const types = {};
  const scopes = {};
  let withLicense = 0;
  let withHash = 0;
  let withPurl = 0;

  for (const c of components) {
    const t = c.type || 'unspecified';
    types[t] = (types[t] || 0) + 1;

    const s = c.scope || 'unspecified';
    scopes[s] = (scopes[s] || 0) + 1;

    if (c.licenses?.length > 0 || c.license) withLicense++;
    if (c.hashes?.length > 0) withHash++;
    if (c.purl) withPurl++;
  }

  return {
    format: sbom.bomFormat || (sbom.spdxVersion ? 'SPDX' : 'unknown'),
    specVersion: sbom.specVersion || sbom.spdxVersion || null,
    componentCount: components.length,
    dependencyCount: deps.length,
    hasTimestamp: !!meta.timestamp,
    hasTools: !!(meta.tools?.length > 0),
    types,
    scopes,
    coverage: {
      license: components.length > 0 ? Math.round((withLicense / components.length) * 100) : 0,
      hash: components.length > 0 ? Math.round((withHash / components.length) * 100) : 0,
      purl: components.length > 0 ? Math.round((withPurl / components.length) * 100) : 0
    }
  };
}

function formatSummaryText(summary) {
  const lines = [];
  lines.push(`Format: ${summary.format} ${summary.specVersion || ''}`);
  lines.push(`Components: ${summary.componentCount}`);
  lines.push(`Dependencies: ${summary.dependencyCount}`);
  lines.push('');
  lines.push('Coverage:');
  lines.push(`  License: ${summary.coverage.license}%`);
  lines.push(`  Hash:    ${summary.coverage.hash}%`);
  lines.push(`  PURL:    ${summary.coverage.purl}%`);

  if (Object.keys(summary.types).length > 0) {
    lines.push('');
    lines.push('Types:');
    for (const [t, count] of Object.entries(summary.types).sort((a, b) => b[1] - a[1])) {
      lines.push(`  ${t}: ${count}`);
    }
  }

  return lines.join('\n');
}

module.exports = { summarize, formatSummaryText };
