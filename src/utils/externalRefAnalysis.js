const KNOWN_REF_TYPES = new Set([
  'vcs', 'issue-tracker', 'website', 'advisories', 'bom',
  'mailing-list', 'social', 'chat', 'documentation', 'support',
  'distribution', 'license', 'build-meta', 'build-system',
  'release-notes', 'security-contact', 'model-card', 'log',
  'configuration', 'evidence', 'formulation', 'attestation',
  'threat-model', 'adversary-model', 'risk-assessment',
  'vulnerability-assertion', 'exploitability-statement',
  'pentest-report', 'static-analysis-report', 'dynamic-analysis-report',
  'runtime-analysis-report', 'component-analysis-report',
  'maturity-report', 'certification-report', 'codified-infrastructure',
  'quality-metrics', 'poam'
]);

function analyzeExternalRefs(components) {
  let withRefs = 0;
  let totalRefs = 0;
  const typeCounts = {};

  for (const c of components) {
    const refs = c.externalReferences || [];
    if (refs.length > 0) withRefs++;
    totalRefs += refs.length;
    for (const ref of refs) {
      const type = ref.type || 'unknown';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    }
  }

  return {
    total: components.length,
    withRefs,
    withoutRefs: components.length - withRefs,
    totalRefs,
    typeCounts,
    coverage: components.length > 0 ? Math.round((withRefs / components.length) * 100) : 0
  };
}

module.exports = { analyzeExternalRefs, KNOWN_REF_TYPES };
