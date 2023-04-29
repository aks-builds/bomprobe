function createSnapshot(sbom) {
  const components = (sbom.components || []).map(c => ({
    name: c.name,
    version: c.version || null,
    purl: c.purl || null,
    type: c.type || null,
    hasLicense: !!(c.licenses?.length),
    hasHash: !!(c.hashes?.length),
    hasSupplier: !!(c.supplier?.name)
  }));

  return {
    format: sbom.bomFormat || sbom.spdxVersion || 'unknown',
    specVersion: sbom.specVersion || null,
    componentCount: components.length,
    timestamp: new Date().toISOString(),
    components
  };
}

function compareSnapshots(before, after) {
  const beforeNames = new Set(before.components.map(c => c.purl || c.name));
  const afterNames = new Set(after.components.map(c => c.purl || c.name));

  let added = 0;
  let removed = 0;
  for (const n of afterNames) {
    if (!beforeNames.has(n)) added++;
  }
  for (const n of beforeNames) {
    if (!afterNames.has(n)) removed++;
  }

  return {
    beforeCount: before.componentCount,
    afterCount: after.componentCount,
    added,
    removed,
    unchanged: after.componentCount - added
  };
}

module.exports = { createSnapshot, compareSnapshots };
