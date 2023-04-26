function searchComponents(sbom, query) {
  const q = query.toLowerCase();
  return (sbom.components || []).filter(c => {
    if (c.name?.toLowerCase().includes(q)) return true;
    if (c.purl?.toLowerCase().includes(q)) return true;
    if (c.group?.toLowerCase().includes(q)) return true;
    if (c.description?.toLowerCase().includes(q)) return true;
    return false;
  });
}

function findByPurl(sbom, purlPattern) {
  const regex = new RegExp(purlPattern, 'i');
  return (sbom.components || []).filter(c => c.purl && regex.test(c.purl));
}

function findByLicense(sbom, licenseId) {
  const id = licenseId.toLowerCase();
  return (sbom.components || []).filter(c => {
    for (const lic of (c.licenses || [])) {
      const licId = (lic.license?.id || lic.id || '').toLowerCase();
      if (licId === id) return true;
      const expr = (lic.expression || '').toLowerCase();
      if (expr.includes(id)) return true;
    }
    return false;
  });
}

function findBySupplier(sbom, supplierName) {
  const q = supplierName.toLowerCase();
  return (sbom.components || []).filter(c =>
    c.supplier?.name?.toLowerCase().includes(q)
  );
}

module.exports = { searchComponents, findByPurl, findByLicense, findBySupplier };
