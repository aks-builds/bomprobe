function normalizeComponent(component) {
  return {
    name: (component.name || '').trim().toLowerCase(),
    version: (component.version || '').trim(),
    type: (component.type || 'library').toLowerCase(),
    scope: (component.scope || 'required').toLowerCase(),
    purl: component.purl || null,
    license: extractLicenseId(component.license),
    supplier: extractSupplierName(component.supplier)
  };
}

function extractLicenseId(license) {
  if (!license) return null;
  if (typeof license === 'string') return license;
  if (license.id) return license.id;
  if (license.expression) return license.expression;
  if (license.license && license.license.id) return license.license.id;
  return null;
}

function extractSupplierName(supplier) {
  if (!supplier) return null;
  if (typeof supplier === 'string') return supplier;
  return supplier.name || null;
}

function normalizeAll(components) {
  return components.map(normalizeComponent);
}

module.exports = { normalizeComponent, normalizeAll };
