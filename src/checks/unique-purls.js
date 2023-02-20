module.exports = {
  id: 'unique-purls',
  name: 'Unique PURLs',
  description: 'Each component should have a unique package URL',
  weight: 0.4,
  run(sbom) {
    const findings = [];
    const seen = new Map();

    for (const c of sbom.components) {
      if (!c.purl) continue;
      if (seen.has(c.purl)) {
        findings.push({
          severity: 'warning',
          component: c.name || 'unnamed',
          message: `Duplicate purl: ${c.purl} (also on ${seen.get(c.purl)})`
        });
      } else {
        seen.set(c.purl, c.name || 'unnamed');
      }
    }

    return findings;
  }
};
