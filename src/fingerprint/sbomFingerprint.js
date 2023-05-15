const { createHash } = require('node:crypto');

function fingerprintSbom(sbom) {
  if (!sbom || typeof sbom !== 'object') return { hash: null, components: 0, signature: '' };

  const components = Array.isArray(sbom.components) ? sbom.components : [];
  const sorted = components
    .filter(c => c && typeof c === 'object')
    .map(c => `${c.name || ''}@${c.version || ''}:${c.purl || ''}`)
    .sort();

  const content = sorted.join('\n');
  const hash = createHash('sha256').update(content).digest('hex');

  return {
    hash,
    components: sorted.length,
    signature: hash.slice(0, 12),
    algorithm: 'sha256'
  };
}

function fingerprintComponent(comp) {
  if (!comp || typeof comp !== 'object') return null;
  const fields = [comp.name, comp.version, comp.purl, comp.type, comp.group].filter(Boolean).join(':');
  return createHash('sha256').update(fields).digest('hex').slice(0, 16);
}

function compareSbomFingerprints(fp1, fp2) {
  if (!fp1 || !fp2) return { match: false, reason: 'missing fingerprint' };
  if (fp1.hash === fp2.hash) return { match: true, reason: 'identical' };

  return {
    match: false,
    reason: fp1.components === fp2.components ? 'same count, different content' : 'different component count',
    delta: {
      components: fp2.components - fp1.components
    }
  };
}

function formatFingerprint(fp) {
  const lines = [];
  lines.push('SBOM Fingerprint');
  lines.push('================');
  lines.push(`Hash: ${fp.hash || 'none'}`);
  lines.push(`Signature: ${fp.signature || 'none'}`);
  lines.push(`Components: ${fp.components}`);
  lines.push(`Algorithm: ${fp.algorithm || 'sha256'}`);
  return lines.join('\n');
}

module.exports = { fingerprintSbom, fingerprintComponent, compareSbomFingerprints, formatFingerprint };
