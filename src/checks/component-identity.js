module.exports = {
  id: 'component-identity',
  name: 'Component Identity Completeness',
  description: 'Components should have at least two identity fields (name+version, purl, cpe)',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      let identifiers = 0;
      if (c.name) identifiers++;
      if (c.version) identifiers++;
      if (c.purl) identifiers++;
      if (c.cpe) identifiers++;
      if (c['bom-ref']) identifiers++;

      if (identifiers < 2) {
        findings.push({
          severity: 'warning',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} has only ${identifiers} identifier(s), need at least 2`
        });
      }
    }
    return findings;
  }
};
