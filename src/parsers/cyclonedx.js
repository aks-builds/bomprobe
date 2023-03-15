function extractSupplier(component) {
  if (component.supplier && component.supplier.name) return component.supplier.name;
  if (component.publisher) return component.publisher;
  if (component.author) return component.author;
  return null;
}

function extractLicense(component) {
  if (!component.licenses || component.licenses.length === 0) return null;
  const first = component.licenses[0];
  if (first.license) {
    return first.license.id || first.license.name || null;
  }
  if (first.expression) return first.expression;
  return null;
}

function extractAuthor(metadata) {
  if (metadata.authors && metadata.authors.length > 0) {
    return metadata.authors[0].name || null;
  }
  if (metadata.manufacture && metadata.manufacture.name) {
    return metadata.manufacture.name;
  }
  return null;
}

function normalize(doc) {
  const metadata = doc.metadata || {};
  const rawComponents = doc.components || [];
  const deps = doc.dependencies || [];

  const components = rawComponents.map(c => ({
    name: c.name || null,
    version: c.version || null,
    supplier: extractSupplier(c),
    license: extractLicense(c),
    purl: c.purl || null,
    cpe: c.cpe || null,
    description: c.description || null,
    hashes: (c.hashes && c.hashes.length) || 0,
    type: c.type || null,
    scope: c.scope || null,
    copyright: c.copyright || null
  }));

  const componentsWithDeps = new Set();
  for (const d of deps) {
    if (d.dependsOn && d.dependsOn.length > 0) {
      componentsWithDeps.add(d.ref);
    }
  }

  return {
    format: 'cyclonedx',
    metadata: {
      author: extractAuthor(metadata),
      timestamp: metadata.timestamp || null,
      toolCount: (metadata.tools && metadata.tools.length) || 0,
      specVersion: doc.specVersion || null,
      documentLicense: null,
      subjectName: (metadata.component && metadata.component.name) || null,
      serialNumber: doc.serialNumber || null,
      documentNamespace: null
    },
    components,
    dependencyGraph: {
      totalEntries: deps.length,
      componentsWithDeps: componentsWithDeps.size,
      coverage: components.length > 0 ? componentsWithDeps.size / components.length : 0
    }
  };
}

module.exports = { normalize };
