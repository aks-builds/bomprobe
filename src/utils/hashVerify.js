const STRONG_ALGORITHMS = new Set(['SHA-256', 'SHA-384', 'SHA-512', 'SHA3-256', 'SHA3-384', 'SHA3-512']);
const WEAK_ALGORITHMS = new Set(['MD5', 'SHA-1', 'MD2', 'MD4']);

function categorizeHash(algorithm) {
  const upper = (algorithm || '').toUpperCase().replace(/\s+/g, '');
  if (STRONG_ALGORITHMS.has(upper)) return 'strong';
  if (WEAK_ALGORITHMS.has(upper)) return 'weak';
  return 'unknown';
}

function analyzeHashes(components) {
  let withHash = 0;
  let withStrongHash = 0;
  let withWeakOnly = 0;
  let noHash = 0;

  for (const c of components) {
    const hashes = c.hashes || [];
    if (hashes.length === 0) {
      noHash++;
      continue;
    }
    withHash++;
    const categories = hashes.map(h => categorizeHash(h.alg || h.algorithm));
    if (categories.some(cat => cat === 'strong')) {
      withStrongHash++;
    } else {
      withWeakOnly++;
    }
  }

  return { total: components.length, withHash, withStrongHash, withWeakOnly, noHash };
}

module.exports = { categorizeHash, analyzeHashes, STRONG_ALGORITHMS, WEAK_ALGORITHMS };
