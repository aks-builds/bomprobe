module.exports = {
  id: 'component-hash-multiple',
  name: 'Multiple Hash Algorithms',
  description: 'Components should have hashes from at least two algorithms for cross-verification',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of (sbom.components || [])) {
      if (!Array.isArray(c.hashes) || c.hashes.length === 0) continue;
      const algs = new Set(c.hashes.map(h => h.alg));
      if (algs.size === 1) {
        findings.push({
          severity: 'info',
          component: c.name,
          message: `${c.name} has only one hash algorithm (${[...algs][0]}), consider adding a second`
        });
      }
    }
    return findings;
  }
};
