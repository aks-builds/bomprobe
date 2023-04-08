const VALID_AGGREGATES = [
  'complete', 'incomplete', 'incomplete_first_party_only',
  'incomplete_first_party_proprietary_only',
  'incomplete_first_party_opensource_only',
  'incomplete_third_party_only',
  'incomplete_third_party_proprietary_only',
  'incomplete_third_party_opensource_only',
  'unknown', 'not_specified'
];

module.exports = {
  id: 'composition-completeness',
  name: 'Composition Completeness',
  description: 'CycloneDX compositions should declare completeness aggregate',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    const compositions = sbom.compositions || [];

    if (compositions.length === 0) {
      findings.push({
        severity: 'info',
        message: 'No compositions declared - consider adding to describe SBOM completeness'
      });
      return findings;
    }

    for (const comp of compositions) {
      if (!comp.aggregate) {
        findings.push({
          severity: 'warning',
          message: 'Composition missing aggregate field'
        });
      } else if (!VALID_AGGREGATES.includes(comp.aggregate)) {
        findings.push({
          severity: 'warning',
          message: `Unknown composition aggregate '${comp.aggregate}'`
        });
      }

      if (comp.aggregate === 'incomplete' || comp.aggregate === 'unknown') {
        findings.push({
          severity: 'info',
          message: `Composition declared as '${comp.aggregate}' - SBOM may be missing components`
        });
      }
    }

    return findings;
  }
};
