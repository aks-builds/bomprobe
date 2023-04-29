module.exports = {
  id: 'spdx-relationship-direction',
  name: 'SPDX Relationship Direction',
  description: 'SPDX relationships should use correct directional types (DEPENDS_ON vs DEPENDENCY_OF)',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const rels = sbom.relationships || [];

    const invertible = {
      DEPENDS_ON: 'DEPENDENCY_OF',
      DEPENDENCY_OF: 'DEPENDS_ON',
      CONTAINS: 'CONTAINED_BY',
      CONTAINED_BY: 'CONTAINS',
      GENERATES: 'GENERATED_FROM',
      GENERATED_FROM: 'GENERATES'
    };

    const seen = new Map();

    for (const r of rels) {
      if (!r.spdxElementId || !r.relatedSpdxElement || !r.relationshipType) continue;

      const key = `${r.spdxElementId}->${r.relatedSpdxElement}`;
      const inverse = invertible[r.relationshipType];

      if (inverse) {
        const reverseKey = `${r.relatedSpdxElement}->${r.spdxElementId}`;
        if (seen.has(reverseKey) && seen.get(reverseKey) === inverse) {
          findings.push({
            severity: 'info',
            message: `Redundant inverse relationship: ${key} ${r.relationshipType} duplicates ${reverseKey} ${inverse}`
          });
        }
      }

      seen.set(key, r.relationshipType);
    }

    return findings;
  }
};
