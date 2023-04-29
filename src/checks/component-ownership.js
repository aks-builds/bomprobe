module.exports = {
  id: 'component-ownership',
  name: 'Component Ownership',
  description: 'Components should have either supplier or author attribution for supply chain traceability',
  weight: 0.2,
  run(sbom) {
    const findings = [];

    for (const c of (sbom.components || [])) {
      const hasSupplier = c.supplier?.name;
      const hasAuthor = c.author || (c.authors && c.authors.length > 0);
      const hasPublisher = c.publisher;

      if (!hasSupplier && !hasAuthor && !hasPublisher) {
        findings.push({
          severity: 'info',
          component: c.name,
          message: `${c.name || 'unnamed'} has no ownership attribution (supplier, author, or publisher)`
        });
      }
    }

    return findings;
  }
};
