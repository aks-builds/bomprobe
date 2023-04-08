function summarizeComponents(components) {
  const types = {};
  const scopes = {};
  let withPurl = 0;
  let withLicense = 0;
  let withHash = 0;
  let withSupplier = 0;
  let withVersion = 0;

  for (const c of components) {
    const type = c.type || 'unknown';
    types[type] = (types[type] || 0) + 1;

    const scope = c.scope || 'unspecified';
    scopes[scope] = (scopes[scope] || 0) + 1;

    if (c.purl) withPurl++;
    if (c.license) withLicense++;
    if (c.hashes > 0 || (Array.isArray(c.hashes) && c.hashes.length > 0)) withHash++;
    if (c.supplier) withSupplier++;
    if (c.version) withVersion++;
  }

  return {
    total: components.length,
    types,
    scopes,
    coverage: {
      purl: components.length > 0 ? withPurl / components.length : 0,
      license: components.length > 0 ? withLicense / components.length : 0,
      hash: components.length > 0 ? withHash / components.length : 0,
      supplier: components.length > 0 ? withSupplier / components.length : 0,
      version: components.length > 0 ? withVersion / components.length : 0
    }
  };
}

module.exports = { summarizeComponents };
