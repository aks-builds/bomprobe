function filterByType(sbom, types) {
  if (!types || types.length === 0) return sbom;
  const allowed = new Set(types.map(t => t.toLowerCase()));
  return {
    ...sbom,
    components: sbom.components.filter(c => allowed.has((c.type || '').toLowerCase()))
  };
}

function filterByScope(sbom, scopes) {
  if (!scopes || scopes.length === 0) return sbom;
  const allowed = new Set(scopes.map(s => s.toLowerCase()));
  return {
    ...sbom,
    components: sbom.components.filter(c => allowed.has((c.scope || 'required').toLowerCase()))
  };
}

function filterByName(sbom, pattern) {
  if (!pattern) return sbom;
  const regex = new RegExp(pattern, 'i');
  return {
    ...sbom,
    components: sbom.components.filter(c => regex.test(c.name || ''))
  };
}

function excludeByName(sbom, pattern) {
  if (!pattern) return sbom;
  const regex = new RegExp(pattern, 'i');
  return {
    ...sbom,
    components: sbom.components.filter(c => !regex.test(c.name || ''))
  };
}

module.exports = { filterByType, filterByScope, filterByName, excludeByName };
