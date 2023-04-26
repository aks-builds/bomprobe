module.exports = {
  id: 'component-vcs-ref',
  name: 'Component VCS Reference',
  description: 'Components should reference a VCS commit or tag for traceability',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (c.type === 'data' || c.type === 'file') continue;

      const refs = c.externalReferences || [];
      const hasVcs = refs.some(r => r.type === 'vcs');
      const hasPedigree = c.pedigree?.commits?.length > 0;

      if (!hasVcs && !hasPedigree) {
        findings.push({
          severity: 'info',
          component: c.name,
          message: `${c.name || 'Unnamed'} has no VCS reference or pedigree commits`
        });
      }
    }
    return findings;
  }
};
