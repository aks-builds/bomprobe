const URL_RE = /^https?:\/\/.+/;

module.exports = {
  id: 'supplier-url',
  name: 'Supplier URL',
  description: 'Supplier names that look like URLs should be valid HTTP URLs',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (!c.supplier) continue;
      if (c.supplier.startsWith('http') && !URL_RE.test(c.supplier)) {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} has malformed supplier URL: ${c.supplier}`
        });
      }
    }
    return findings;
  }
};
