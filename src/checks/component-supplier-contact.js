module.exports = {
  id: 'component-supplier-contact',
  name: 'Component Supplier Contact',
  description: 'Suppliers should have contact info (email, url, or phone) for supply chain communication',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      const sup = c.supplier;
      if (!sup?.name) continue;

      const hasContact = sup.url?.length > 0 ||
        (sup.contact || []).some(ct => ct.email || ct.phone);

      if (!hasContact) {
        findings.push({
          severity: 'info',
          component: c.name,
          message: `Supplier ${sup.name} for ${c.name || 'Unnamed'} has no contact information`
        });
      }
    }
    return findings;
  }
};
