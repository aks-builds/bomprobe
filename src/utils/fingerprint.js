const { createHash } = require('node:crypto');

function fingerprintComponent(component) {
  const parts = [
    component.name || '',
    component.version || '',
    component.purl || '',
    component.supplier || ''
  ];
  return createHash('sha256').update(parts.join('|')).digest('hex').slice(0, 16);
}

function fingerprintSbom(sbom) {
  const componentHashes = (sbom.components || [])
    .map(c => fingerprintComponent(c))
    .sort();
  return createHash('sha256').update(componentHashes.join(',')).digest('hex').slice(0, 32);
}

function findDuplicateFingerprints(components) {
  const seen = new Map();
  const duplicates = [];
  for (const c of components) {
    const fp = fingerprintComponent(c);
    if (seen.has(fp)) {
      duplicates.push({ original: seen.get(fp), duplicate: c.name, fingerprint: fp });
    } else {
      seen.set(fp, c.name);
    }
  }
  return duplicates;
}

module.exports = { fingerprintComponent, fingerprintSbom, findDuplicateFingerprints };
