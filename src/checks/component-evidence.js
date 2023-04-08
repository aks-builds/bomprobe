module.exports = {
  id: 'component-evidence',
  name: 'Component Evidence',
  description: 'Components should include evidence of identity (occurrences, callstack)',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      const evidence = c.evidence || {};
      const hasIdentity = evidence.identity || evidence.occurrences || evidence.callstack;
      if (!hasIdentity) {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} has no evidence of identity or occurrence`
        });
      }
    }
    return findings;
  }
};
