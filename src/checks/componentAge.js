module.exports = {
  id: 'component-age',
  name: 'Component Age',
  description: 'Components should have recent release dates; stale dependencies are a supply chain risk',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const now = new Date();
    const staleThreshold = 365 * 3;

    for (const c of (sbom.components || [])) {
      const releaseDate = c.releaseDate || c.modified;
      if (!releaseDate) continue;

      const date = new Date(releaseDate);
      if (isNaN(date.getTime())) continue;

      const daysSince = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      if (daysSince > staleThreshold) {
        findings.push({
          severity: 'info',
          component: c.name,
          message: `${c.name || 'unnamed'} last released ${daysSince} days ago (${releaseDate})`
        });
      }
    }

    return findings;
  }
};
