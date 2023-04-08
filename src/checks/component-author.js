module.exports = {
  id: 'component-author',
  name: 'Component Author',
  description: 'Components should have author or publisher information',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      const hasAuthor = c.author || c.publisher || c.supplier;
      if (!hasAuthor) {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} has no author, publisher, or supplier`
        });
      }
    }
    return findings;
  }
};
