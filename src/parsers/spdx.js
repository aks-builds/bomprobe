function extractLicense(pkg) {
  if (!pkg.licenseDeclared || pkg.licenseDeclared === 'NOASSERTION') return null;
  return pkg.licenseDeclared;
}

function extractPurl(pkg) {
  if (!pkg.externalRefs) return null;
  const purlRef = pkg.externalRefs.find(r => r.referenceType === 'purl');
  return purlRef ? purlRef.referenceLocator : null;
}

function extractCpe(pkg) {
  if (!pkg.externalRefs) return null;
  const cpeRef = pkg.externalRefs.find(r =>
    r.referenceType === 'cpe23Type' || r.referenceType === 'cpe22Type'
  );
  return cpeRef ? cpeRef.referenceLocator : null;
}

function extractCreator(creationInfo) {
  if (!creationInfo || !creationInfo.creators) return null;
  for (const c of creationInfo.creators) {
    if (c.startsWith('Organization:')) return c.replace('Organization:', '').trim();
    if (c.startsWith('Person:')) return c.replace('Person:', '').trim();
  }
  return null;
}

function normalize(doc) {
  const creationInfo = doc.creationInfo || {};
  const rawPackages = doc.packages || [];
  const relationships = doc.relationships || [];

  const packages = rawPackages.filter(p => p.SPDXID !== 'SPDXRef-DOCUMENT');

  const components = packages.map(p => ({
    name: p.name || null,
    version: p.versionInfo || null,
    supplier: (p.supplier && p.supplier !== 'NOASSERTION') ? p.supplier : null,
    license: extractLicense(p),
    purl: extractPurl(p),
    cpe: extractCpe(p),
    description: p.description || null,
    hashes: (p.checksums && p.checksums.length) || 0,
    type: null,
    scope: null,
    copyright: (p.copyrightText && p.copyrightText !== 'NOASSERTION') ? p.copyrightText : null
  }));

  const toolCreators = (creationInfo.creators || []).filter(c => c.startsWith('Tool:'));

  const dependsOnRels = relationships.filter(r => r.relationshipType === 'DEPENDS_ON');
  const componentsWithDeps = new Set(dependsOnRels.map(r => r.spdxElementId));

  return {
    format: 'spdx',
    metadata: {
      author: extractCreator(creationInfo),
      timestamp: creationInfo.created || null,
      toolCount: toolCreators.length,
      specVersion: doc.spdxVersion || null,
      documentLicense: doc.dataLicense || null
    },
    components,
    dependencyGraph: {
      totalEntries: dependsOnRels.length,
      componentsWithDeps: componentsWithDeps.size,
      coverage: components.length > 0 ? componentsWithDeps.size / components.length : 0
    }
  };
}

module.exports = { normalize };
