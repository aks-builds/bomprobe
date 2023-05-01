const FIELD_WEIGHTS = {
  name: 10,
  version: 10,
  purl: 8,
  type: 5,
  supplier: 7,
  licenses: 8,
  hashes: 7,
  description: 3,
  copyright: 3,
  externalReferences: 4,
  scope: 3,
  group: 2
};

function scoreCompleteness(sbom) {
  const components = Array.isArray(sbom?.components) ? sbom.components : [];
  if (components.length === 0) return { overall: 0, perField: {}, perComponent: [], components: 0 };

  const perField = {};
  const perComponent = [];
  const totalWeight = Object.values(FIELD_WEIGHTS).reduce((a, b) => a + b, 0);

  for (const field of Object.keys(FIELD_WEIGHTS)) {
    let present = 0;
    for (const comp of components) {
      if (hasField(comp, field)) present++;
    }
    perField[field] = {
      coverage: Math.round(present / components.length * 100),
      present,
      missing: components.length - present,
      weight: FIELD_WEIGHTS[field]
    };
  }

  for (const comp of components) {
    let score = 0;
    const fields = {};
    for (const [field, weight] of Object.entries(FIELD_WEIGHTS)) {
      const has = hasField(comp, field);
      fields[field] = has;
      if (has) score += weight;
    }
    perComponent.push({
      name: comp.name || 'unknown',
      version: comp.version || '',
      score: Math.round(score / totalWeight * 100),
      fields
    });
  }

  const overall = Math.round(
    perComponent.reduce((s, c) => s + c.score, 0) / perComponent.length
  );

  return { overall, perField, perComponent, components: components.length };
}

function hasField(comp, field) {
  if (!comp) return false;
  switch (field) {
    case 'name': return !!comp.name;
    case 'version': return !!comp.version && comp.version !== '0.0.0';
    case 'purl': return !!comp.purl;
    case 'type': return !!comp.type;
    case 'supplier': return !!(comp.supplier?.name || comp.supplier?.url);
    case 'licenses': return Array.isArray(comp.licenses) && comp.licenses.length > 0;
    case 'hashes': return Array.isArray(comp.hashes) && comp.hashes.length > 0;
    case 'description': return !!comp.description;
    case 'copyright': return !!comp.copyright;
    case 'externalReferences': return Array.isArray(comp.externalReferences) && comp.externalReferences.length > 0;
    case 'scope': return !!comp.scope;
    case 'group': return !!comp.group;
    default: return false;
  }
}

function formatCompleteness(result) {
  const lines = [];
  lines.push('Completeness Score');
  lines.push('==================');
  lines.push(`Overall: ${result.overall}% across ${result.components} components`);
  lines.push('');
  lines.push('Field coverage:');

  const sorted = Object.entries(result.perField).sort((a, b) => a[1].coverage - b[1].coverage);
  for (const [field, data] of sorted) {
    const bar = '#'.repeat(Math.round(data.coverage / 5));
    lines.push(`  ${field.padEnd(20)} ${String(data.coverage).padStart(3)}% ${bar}`);
  }

  const weak = result.perComponent.filter(c => c.score < 40);
  if (weak.length > 0) {
    lines.push(`\nWeak components (score < 40%, ${weak.length} total):`);
    for (const c of weak.slice(0, 10)) {
      const missing = Object.entries(c.fields).filter(([, v]) => !v).map(([k]) => k);
      lines.push(`  ${c.name}@${c.version} (${c.score}%) - missing: ${missing.join(', ')}`);
    }
  }

  return lines.join('\n');
}

module.exports = { scoreCompleteness, formatCompleteness, hasField, FIELD_WEIGHTS };
