function searchComponents(components, query) {
  const q = query.toLowerCase();
  return components.filter(c => {
    const name = (c.name || '').toLowerCase();
    const version = (c.version || '').toLowerCase();
    const purl = (c.purl || '').toLowerCase();
    return name.includes(q) || version.includes(q) || purl.includes(q);
  });
}

function findByPurl(components, purl) {
  return components.find(c => c.purl === purl) || null;
}

function findByName(components, name) {
  const lower = name.toLowerCase();
  return components.filter(c => (c.name || '').toLowerCase() === lower);
}

module.exports = { searchComponents, findByPurl, findByName };
