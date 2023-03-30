module.exports = {
  id: 'hash-algorithm',
  name: 'Hash Algorithm',
  description: 'Components with hashes should use SHA-256 or stronger, not MD5 or SHA-1',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (!c.hashAlgorithms || c.hashAlgorithms.length === 0) continue;
      for (const alg of c.hashAlgorithms) {
        const lower = alg.toLowerCase();
        if (lower === 'md5' || lower === 'sha-1' || lower === 'sha1') {
          findings.push({
            severity: 'warning',
            component: c.name || 'unnamed',
            message: `${c.name || 'Unnamed'} uses weak hash algorithm: ${alg}`
          });
        }
      }
    }
    return findings;
  }
};
