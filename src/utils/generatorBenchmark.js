function identifyGenerator(sbom) {
  const tools = sbom.metadata?.tools || [];
  const toolList = Array.isArray(tools) ? tools : (tools.components || []);

  for (const t of toolList) {
    const name = (t.name || '').toLowerCase();
    if (name.includes('syft')) return { name: 'Syft', vendor: 'Anchore', version: t.version };
    if (name.includes('trivy')) return { name: 'Trivy', vendor: 'Aqua Security', version: t.version };
    if (name.includes('cdxgen')) return { name: 'cdxgen', vendor: 'CycloneDX', version: t.version };
    if (name.includes('grype')) return { name: 'Grype', vendor: 'Anchore', version: t.version };
    if (name.includes('cyclonedx-node')) return { name: 'cyclonedx-node', vendor: 'CycloneDX', version: t.version };
    if (name.includes('spdx-sbom-generator')) return { name: 'spdx-sbom-generator', vendor: 'SPDX', version: t.version };
    if (name.includes('ort')) return { name: 'ORT', vendor: 'OSS Review Toolkit', version: t.version };
  }

  if (sbom.metadata?.tools?.length > 0) {
    return { name: toolList[0]?.name || 'unknown', vendor: toolList[0]?.vendor || 'unknown', version: toolList[0]?.version };
  }

  return { name: 'unknown', vendor: 'unknown', version: null };
}

function benchmarkSbom(sbom) {
  const components = sbom.components || [];
  const total = components.length;
  if (total === 0) return { total: 0, scores: {} };

  const hasName = components.filter(c => c.name).length;
  const hasVersion = components.filter(c => c.version).length;
  const hasPurl = components.filter(c => c.purl).length;
  const hasLicense = components.filter(c => c.licenses?.length > 0 || c.license).length;
  const hasHash = components.filter(c => Array.isArray(c.hashes) && c.hashes.length > 0).length;
  const hasSupplier = components.filter(c => c.supplier?.name || c.supplier?.url).length;
  const hasType = components.filter(c => c.type).length;
  const hasCpe = components.filter(c => c.cpe).length;
  const hasScope = components.filter(c => c.scope).length;
  const hasDescription = components.filter(c => c.description).length;

  return {
    total,
    generator: identifyGenerator(sbom),
    scores: {
      name: hasName / total,
      version: hasVersion / total,
      purl: hasPurl / total,
      license: hasLicense / total,
      hash: hasHash / total,
      supplier: hasSupplier / total,
      type: hasType / total,
      cpe: hasCpe / total,
      scope: hasScope / total,
      description: hasDescription / total
    }
  };
}

function formatBenchmark(benchmark) {
  const lines = [];
  const gen = benchmark.generator;
  lines.push(`Generator: ${gen.name}${gen.version ? ' ' + gen.version : ''} (${gen.vendor})`);
  lines.push(`Components: ${benchmark.total}`);
  lines.push('');
  lines.push('Field coverage:');

  for (const [field, pct] of Object.entries(benchmark.scores)) {
    const bar = '#'.repeat(Math.round(pct * 20)).padEnd(20, '.');
    lines.push(`  ${field.padEnd(14)} [${bar}] ${(pct * 100).toFixed(0)}%`);
  }

  return lines.join('\n');
}

module.exports = { identifyGenerator, benchmarkSbom, formatBenchmark };
