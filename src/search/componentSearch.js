function searchComponents(sbom, query) {
  const components = Array.isArray(sbom?.components) ? sbom.components : [];
  if (!query || typeof query !== 'string') return components;

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return components.filter(comp => {
    if (!comp) return false;
    const text = [
      comp.name, comp.version, comp.purl, comp.type,
      comp.group, comp.description, comp.copyright
    ].filter(Boolean).join(' ').toLowerCase();
    return terms.every(t => text.includes(t));
  });
}

function findByPurl(sbom, purlPattern) {
  const components = Array.isArray(sbom?.components) ? sbom.components : [];
  const pattern = purlPattern.toLowerCase();
  return components.filter(c => c?.purl && c.purl.toLowerCase().includes(pattern));
}

function findByLicense(sbom, licenseId) {
  const components = Array.isArray(sbom?.components) ? sbom.components : [];
  const target = licenseId.toLowerCase();
  return components.filter(comp => {
    if (!comp || !Array.isArray(comp.licenses)) return false;
    return comp.licenses.some(lic => {
      const id = (lic?.license?.id || lic?.license?.name || lic?.expression || '').toLowerCase();
      return id.includes(target);
    });
  });
}

function findByType(sbom, type) {
  const components = Array.isArray(sbom?.components) ? sbom.components : [];
  const target = type.toLowerCase();
  return components.filter(c => c?.type && c.type.toLowerCase() === target);
}

function findByScope(sbom, scope) {
  const components = Array.isArray(sbom?.components) ? sbom.components : [];
  const target = scope.toLowerCase();
  return components.filter(c => c?.scope && c.scope.toLowerCase() === target);
}

function findMissing(sbom, field) {
  const components = Array.isArray(sbom?.components) ? sbom.components : [];
  return components.filter(comp => {
    if (!comp) return true;
    switch (field) {
      case 'purl': return !comp.purl;
      case 'version': return !comp.version;
      case 'license': return !Array.isArray(comp.licenses) || comp.licenses.length === 0;
      case 'supplier': return !comp.supplier?.name;
      case 'hash': return !Array.isArray(comp.hashes) || comp.hashes.length === 0;
      case 'description': return !comp.description;
      case 'type': return !comp.type;
      default: return !comp[field];
    }
  });
}

function formatSearchResults(results, query) {
  const lines = [];
  lines.push(`Search: "${query}" - ${results.length} results`);
  lines.push('');
  for (const c of results.slice(0, 50)) {
    const name = c.name || 'unknown';
    const version = c.version || '?';
    const type = c.type || '?';
    const purl = c.purl || '';
    lines.push(`  ${name}@${version} (${type}) ${purl}`);
  }
  if (results.length > 50) lines.push(`  ... and ${results.length - 50} more`);
  return lines.join('\n');
}

module.exports = { searchComponents, findByPurl, findByLicense, findByType, findByScope, findMissing, formatSearchResults };
