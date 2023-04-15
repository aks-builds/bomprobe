module.exports = {
  id: 'component-eol',
  name: 'Component End of Life',
  description: 'Components should not have end-of-life or deprecated lifecycle status',
  weight: 0.3,
  run(sbom) {
    const findings = [];
    const eolIndicators = ['end-of-life', 'eol', 'deprecated', 'superseded', 'retired'];

    for (const c of sbom.components) {
      const props = c.properties || [];
      for (const p of props) {
        const val = (p.value || '').toLowerCase();
        const name = (p.name || '').toLowerCase();
        if (eolIndicators.some(e => val.includes(e) || name.includes(e))) {
          findings.push({
            severity: 'warning',
            component: c.name || 'unnamed',
            message: `${c.name || 'Unnamed'} has end-of-life indicator: ${p.name}=${p.value}`
          });
        }
      }

      if (c.pedigree?.notes) {
        const notes = c.pedigree.notes.toLowerCase();
        if (eolIndicators.some(e => notes.includes(e))) {
          findings.push({
            severity: 'warning',
            component: c.name || 'unnamed',
            message: `${c.name || 'Unnamed'} pedigree indicates end-of-life status`
          });
        }
      }
    }
    return findings;
  }
};
