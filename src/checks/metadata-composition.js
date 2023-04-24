const VALID_AGGREGATES = new Set([
  'complete', 'incomplete', 'incomplete_first_party_only',
  'incomplete_third_party_only', 'unknown', 'not_specified'
]);

module.exports = {
  id: 'metadata-composition',
  name: 'Metadata Composition Declaration',
  description: 'SBOM should declare its composition completeness level',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const compositions = sbom.compositions || [];

    if (compositions.length === 0) {
      findings.push({
        severity: 'info',
        message: 'No composition completeness declaration found'
      });
      return findings;
    }

    for (const comp of compositions) {
      if (!comp.aggregate) {
        findings.push({
          severity: 'warning',
          message: 'Composition entry missing aggregate type'
        });
      } else if (!VALID_AGGREGATES.has(comp.aggregate)) {
        findings.push({
          severity: 'warning',
          message: `Unknown composition aggregate: "${comp.aggregate}"`
        });
      }
    }

    return findings;
  }
};
