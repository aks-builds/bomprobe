function stripFindings(sbom) {
  const copy = { ...sbom };
  if (copy.components) {
    copy.components = copy.components.map(c => {
      const { _findings, ...rest } = c;
      return rest;
    });
  }
  return copy;
}

function addProperty(sbom, key, value) {
  const copy = { ...sbom };
  if (!copy.metadata) copy.metadata = {};
  if (!copy.metadata.properties) copy.metadata.properties = [];
  copy.metadata.properties.push({ name: key, value: String(value) });
  return copy;
}

function removeComponents(sbom, names) {
  const nameSet = new Set(names);
  const copy = { ...sbom };
  copy.components = (copy.components || []).filter(c => !nameSet.has(c.name));
  return copy;
}

function sortComponents(sbom, field = 'name') {
  const copy = { ...sbom };
  copy.components = [...(copy.components || [])].sort((a, b) => {
    const va = (a[field] || '').toLowerCase();
    const vb = (b[field] || '').toLowerCase();
    return va < vb ? -1 : va > vb ? 1 : 0;
  });
  return copy;
}

module.exports = { stripFindings, addProperty, removeComponents, sortComponents };
