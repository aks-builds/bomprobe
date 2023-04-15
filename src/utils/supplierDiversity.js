function analyzeSupplierDiversity(components) {
  const suppliers = new Map();
  let noSupplier = 0;

  for (const c of components) {
    const supplier = extractSupplier(c);
    if (!supplier) {
      noSupplier++;
      continue;
    }
    if (!suppliers.has(supplier)) {
      suppliers.set(supplier, []);
    }
    suppliers.get(supplier).push(c.name || 'unnamed');
  }

  const sorted = [...suppliers.entries()]
    .map(([name, components]) => ({ name, count: components.length, components }))
    .sort((a, b) => b.count - a.count);

  const topSupplier = sorted[0] || null;
  const concentration = topSupplier && components.length > 0
    ? Math.round((topSupplier.count / components.length) * 100)
    : 0;

  return {
    totalSuppliers: suppliers.size,
    totalComponents: components.length,
    noSupplier,
    suppliers: sorted,
    topSupplier: topSupplier ? topSupplier.name : null,
    concentration
  };
}

function extractSupplier(component) {
  if (component.supplier) {
    return typeof component.supplier === 'string'
      ? component.supplier
      : component.supplier.name || null;
  }
  return component.author || component.publisher || null;
}

module.exports = { analyzeSupplierDiversity };
