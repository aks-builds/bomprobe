module.exports = {
  id: 'component-nested-bom',
  name: 'Component Nested BOM Reference',
  description: 'Components referencing nested BOMs should have valid bom-ref links',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const knownRefs = new Set();

    for (const c of sbom.components) {
      if (c['bom-ref']) knownRefs.add(c['bom-ref']);
    }

    for (const c of sbom.components) {
      const nested = c.components || [];
      for (const child of nested) {
        if (child['bom-ref'] && knownRefs.has(child['bom-ref'])) {
          findings.push({
            severity: 'warning',
            message: `Nested component "${child.name || child['bom-ref']}" duplicates a top-level bom-ref`
          });
        }
        if (!child.name && !child['bom-ref']) {
          findings.push({
            severity: 'info',
            message: `Nested component in "${c.name || 'unknown'}" has no name or bom-ref`
          });
        }
      }
    }

    return findings;
  }
};
