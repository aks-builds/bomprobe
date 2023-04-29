function enrichWithDefaults(sbom) {
  const copy = { ...sbom };

  if (!copy.metadata) copy.metadata = {};
  if (!copy.metadata.timestamp) {
    copy.metadata.timestamp = new Date().toISOString();
  }

  copy.components = (copy.components || []).map(c => {
    const enriched = { ...c };
    if (!enriched.type) enriched.type = 'library';
    if (!enriched.scope) enriched.scope = 'required';
    return enriched;
  });

  return copy;
}

function enrichWithScores(sbom, results) {
  const scoreMap = new Map();
  for (const r of results) {
    for (const f of r.findings) {
      if (f.component) {
        const current = scoreMap.get(f.component) || { errors: 0, warnings: 0, infos: 0 };
        if (f.severity === 'error') current.errors++;
        else if (f.severity === 'warning') current.warnings++;
        else current.infos++;
        scoreMap.set(f.component, current);
      }
    }
  }

  const copy = { ...sbom };
  copy.components = (copy.components || []).map(c => {
    const scores = scoreMap.get(c.name);
    if (!scores) return c;
    return { ...c, properties: [...(c.properties || []),
      { name: 'bomprobe:errors', value: String(scores.errors) },
      { name: 'bomprobe:warnings', value: String(scores.warnings) }
    ]};
  });

  return copy;
}

module.exports = { enrichWithDefaults, enrichWithScores };
