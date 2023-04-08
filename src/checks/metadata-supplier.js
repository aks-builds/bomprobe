module.exports = {
  id: 'metadata-supplier',
  name: 'Metadata Supplier',
  description: 'SBOM metadata should include supplier information for the subject',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    const meta = sbom.metadata || {};
    const component = meta.component || {};

    if (!meta.supplier && !component.supplier) {
      findings.push({
        severity: 'info',
        message: 'No supplier information in SBOM metadata'
      });
    }

    return findings;
  }
};
