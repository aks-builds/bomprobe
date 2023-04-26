module.exports = {
  id: 'component-attestation',
  name: 'Component Attestation',
  description: 'Components should have attestation or evidence data for supply chain trust',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (c.type === 'data' || c.type === 'file') continue;

      const hasEvidence = c.evidence?.identity?.length > 0 || c.evidence?.occurrences?.length > 0;
      const hasSignature = c.signature || c.hashes?.some(h => h.alg?.startsWith('SHA'));
      const hasPedigree = c.pedigree?.ancestors?.length > 0 || c.pedigree?.commits?.length > 0;

      if (!hasEvidence && !hasSignature && !hasPedigree) {
        findings.push({
          severity: 'info',
          component: c.name,
          message: `${c.name || 'Unnamed'} has no attestation evidence (evidence, signature, or pedigree)`
        });
      }
    }
    return findings;
  }
};
