const KNOWN_SCOPES = new Set(['required', 'optional', 'excluded']);

function analyzeScopes(components) {
  const counts = { required: 0, optional: 0, excluded: 0, unspecified: 0, unknown: 0 };

  for (const c of components) {
    const scope = (c.scope || '').toLowerCase();
    if (!scope) {
      counts.unspecified++;
    } else if (KNOWN_SCOPES.has(scope)) {
      counts[scope]++;
    } else {
      counts.unknown++;
    }
  }

  return {
    ...counts,
    total: components.length,
    coverage: components.length > 0
      ? Math.round(((counts.required + counts.optional + counts.excluded) / components.length) * 100)
      : 0
  };
}

function findDevDependencies(components) {
  return components.filter(c => {
    const scope = (c.scope || '').toLowerCase();
    return scope === 'optional' || scope === 'excluded';
  });
}

module.exports = { analyzeScopes, findDevDependencies, KNOWN_SCOPES };
