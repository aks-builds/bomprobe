function analyzeSuppliers(sbom) {
  const suppliers = new Map();
  let missing = 0;

  for (const c of sbom.components) {
    if (!c.supplier) {
      missing++;
      continue;
    }
    const name = c.supplier.trim();
    if (!suppliers.has(name)) {
      suppliers.set(name, { name, count: 0, components: [] });
    }
    const entry = suppliers.get(name);
    entry.count++;
    entry.components.push(c.name);
  }

  const sorted = [...suppliers.values()].sort((a, b) => b.count - a.count);
  const concentration = sorted.length > 0
    ? sorted[0].count / sbom.components.length
    : 0;

  return {
    total: sbom.components.length,
    unique: suppliers.size,
    missing,
    concentration: Math.round(concentration * 100),
    suppliers: sorted
  };
}

module.exports = { analyzeSuppliers };
