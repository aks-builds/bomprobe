module.exports = {
  id: 'component-provenance',
  name: 'Component Provenance',
  description: 'Components should include provenance data for supply chain verification',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      const hasProvenance = c.pedigree || c.evidence || c.properties?.some(p =>
        (p.name || '').toLowerCase().includes('provenance') ||
        (p.name || '').toLowerCase().includes('build') ||
        (p.name || '').toLowerCase().includes('source')
      );

      if (!hasProvenance && c.type !== 'data') {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} has no provenance or build origin data`
        });
      }
    }
    return findings;
  }
};
