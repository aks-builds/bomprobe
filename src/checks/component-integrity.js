module.exports = {
  id: 'component-integrity',
  name: 'Component Integrity',
  description: 'Components with hashes should use secure algorithms (SHA-256+), not MD5 or SHA-1 alone',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    const weak = new Set(['MD5', 'SHA-1']);

    for (const c of (sbom.components || [])) {
      if (!c.hashes || c.hashes.length === 0) continue;

      const algos = c.hashes.map(h => h.alg);
      const hasStrong = algos.some(a => !weak.has(a));

      if (!hasStrong) {
        findings.push({
          severity: 'warning',
          component: c.name,
          message: `${c.name || 'unnamed'} only has weak hash algorithms: ${algos.join(', ')}`
        });
      }
    }

    return findings;
  }
};
