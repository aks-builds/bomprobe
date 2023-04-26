module.exports = {
  id: 'component-alternative',
  name: 'Component Alternative Identifier',
  description: 'Components should have at least two identifiers (name, purl, cpe, swid, bom-ref)',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      let ids = 0;
      if (c.name) ids++;
      if (c.purl) ids++;
      if (c.cpe) ids++;
      if (c.swid) ids++;
      if (c['bom-ref']) ids++;

      if (ids < 2) {
        findings.push({
          severity: 'info',
          component: c.name,
          message: `${c.name || 'Unnamed'} has only ${ids} identifier(s), recommend at least 2`
        });
      }
    }
    return findings;
  }
};
