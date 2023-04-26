function collectStats(sbom) {
  const components = sbom.components || [];
  const stats = {
    totalComponents: components.length,
    byType: {},
    byScope: {},
    withLicense: 0,
    withPurl: 0,
    withHash: 0,
    withVersion: 0,
    withSupplier: 0,
    avgPropsPerComponent: 0
  };

  let totalProps = 0;
  for (const c of components) {
    const type = c.type || 'unspecified';
    stats.byType[type] = (stats.byType[type] || 0) + 1;

    const scope = c.scope || 'required';
    stats.byScope[scope] = (stats.byScope[scope] || 0) + 1;

    if (c.licenses?.length) stats.withLicense++;
    if (c.purl) stats.withPurl++;
    if (c.hashes?.length) stats.withHash++;
    if (c.version) stats.withVersion++;
    if (c.supplier?.name) stats.withSupplier++;

    totalProps += Object.keys(c).length;
  }

  stats.avgPropsPerComponent = components.length > 0
    ? Math.round((totalProps / components.length) * 10) / 10
    : 0;

  return stats;
}

function formatStatsText(stats) {
  const lines = [`Components: ${stats.totalComponents}`];
  lines.push(`  With license: ${stats.withLicense} (${pct(stats.withLicense, stats.totalComponents)})`);
  lines.push(`  With purl: ${stats.withPurl} (${pct(stats.withPurl, stats.totalComponents)})`);
  lines.push(`  With hash: ${stats.withHash} (${pct(stats.withHash, stats.totalComponents)})`);
  lines.push(`  With version: ${stats.withVersion} (${pct(stats.withVersion, stats.totalComponents)})`);
  lines.push(`  With supplier: ${stats.withSupplier} (${pct(stats.withSupplier, stats.totalComponents)})`);
  lines.push(`  Avg properties: ${stats.avgPropsPerComponent}`);
  lines.push('');
  lines.push('By type:');
  for (const [t, n] of Object.entries(stats.byType).sort((a, b) => b[1] - a[1])) {
    lines.push(`  ${t}: ${n}`);
  }
  return lines.join('\n');
}

function pct(n, total) {
  if (total === 0) return '0%';
  return Math.round((n / total) * 100) + '%';
}

module.exports = { collectStats, formatStatsText };
