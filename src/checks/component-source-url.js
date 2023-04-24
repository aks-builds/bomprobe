module.exports = {
  id: 'component-source-url',
  name: 'Component Source URL',
  description: 'Components should have a source repository or VCS external reference',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      const refs = c.externalReferences || [];
      const hasSource = refs.some(r => r.type === 'vcs' || r.type === 'source-distribution');
      const hasPurl = !!c.purl;

      if (!hasSource && !hasPurl) {
        findings.push({
          severity: 'info',
          component: c.name,
          message: `${c.name || 'Unnamed'} has no source URL or purl for traceability`
        });
      }
    }
    return findings;
  }
};
