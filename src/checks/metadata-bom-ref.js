module.exports = {
  id: 'metadata-bom-ref',
  name: 'Metadata BOM Reference',
  description: 'CycloneDX BOMs should have unique bom-ref values across all components',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const seen = new Map();

    for (const c of (sbom.components || [])) {
      const ref = c['bom-ref'];
      if (!ref) continue;

      if (seen.has(ref)) {
        findings.push({
          severity: 'error',
          component: c.name,
          message: `Duplicate bom-ref '${ref}' between ${seen.get(ref)} and ${c.name || 'Unnamed'}`
        });
      } else {
        seen.set(ref, c.name || 'Unnamed');
      }
    }

    return findings;
  }
};
