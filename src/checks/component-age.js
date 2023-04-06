module.exports = {
  id: 'component-age',
  name: 'Component Age',
  description: 'Components should have recent version timestamps when available',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    const now = Date.now();
    const twoYears = 2 * 365 * 24 * 60 * 60 * 1000;

    for (const c of sbom.components) {
      if (!c.modified && !c.timestamp) continue;
      const dateStr = c.modified || c.timestamp;
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) continue;

      const age = now - date.getTime();
      if (age > twoYears) {
        const years = Math.floor(age / (365 * 24 * 60 * 60 * 1000));
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} was last updated ${years} years ago`
        });
      }
    }

    return findings;
  }
};
