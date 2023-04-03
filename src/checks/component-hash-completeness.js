const RECOMMENDED = ['SHA-256', 'SHA-512'];

module.exports = {
  id: 'component-hash-completeness',
  name: 'Component Hash Completeness',
  description: 'Components with hashes should include at least one strong algorithm',
  weight: 0.3,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (!c.hashes || c.hashes.length === 0) continue;
      const algos = (c.hashAlgorithms || []).map(a => a.toUpperCase());
      const hasStrong = algos.some(a => RECOMMENDED.includes(a));
      if (!hasStrong) {
        findings.push({
          severity: 'warning',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} has hashes but none use ${RECOMMENDED.join(' or ')}`
        });
      }
    }
    return findings;
  }
};
