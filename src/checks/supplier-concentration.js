const { analyzeSuppliers } = require('../utils/supplierAnalysis');

module.exports = {
  id: 'supplier-concentration',
  name: 'Supplier Concentration',
  description: 'High supplier concentration increases single-vendor risk',
  weight: 0.3,
  run(sbom) {
    const findings = [];
    const analysis = analyzeSuppliers(sbom);

    if (analysis.total < 3) return findings;

    if (analysis.concentration > 80) {
      findings.push({
        severity: 'warning',
        message: `${analysis.concentration}% of components come from a single supplier (${analysis.suppliers[0].name})`
      });
    }

    if (analysis.missing > analysis.total * 0.5) {
      findings.push({
        severity: 'info',
        message: `${analysis.missing} of ${analysis.total} components have no supplier information`
      });
    }

    return findings;
  }
};
