module.exports = {
  id: 'spdx-relationship-completeness',
  name: 'SPDX Relationship Completeness',
  description: 'SPDX documents should have DESCRIBES relationships from document to packages',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    if (sbom.format !== 'spdx') return findings;

    const relationships = sbom.spdxRelationships || [];
    if (relationships.length === 0) return findings;

    const describes = relationships.filter(r => r.type === 'DESCRIBES');
    if (describes.length === 0) {
      findings.push({
        severity: 'warning',
        message: 'No DESCRIBES relationship found - document should describe at least one package'
      });
    }

    const packageIds = new Set((sbom.components || []).map(c => c.spdxId).filter(Boolean));
    const referenced = new Set();
    for (const r of relationships) {
      referenced.add(r.element);
      referenced.add(r.related);
    }

    for (const id of packageIds) {
      if (!referenced.has(id)) {
        findings.push({
          severity: 'info',
          component: id,
          message: `Package ${id} is not referenced in any relationship`
        });
      }
    }

    return findings;
  }
};
