module.exports = {
  id: 'metadata-contact-info',
  name: 'Metadata Contact Information',
  description: 'SBOM metadata should include contact information for the author or supplier',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const meta = sbom.metadata || {};
    const hasAuthorContact = meta.authors?.some(a => a.email || a.phone);
    const hasSupplierContact = meta.supplier?.contact?.some(c => c.email || c.phone);
    const hasManufactureContact = meta.manufacture?.contact?.some(c => c.email || c.phone);

    if (!hasAuthorContact && !hasSupplierContact && !hasManufactureContact) {
      findings.push({
        severity: 'info',
        message: 'SBOM metadata has no contact information (author email, supplier contact, or manufacture contact)'
      });
    }
    return findings;
  }
};
