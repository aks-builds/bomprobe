module.exports = {
  id: 'component-crypto',
  name: 'Component Crypto Properties',
  description: 'Components with crypto functionality should declare cryptographic properties',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const cryptoKeywords = ['crypto', 'cipher', 'tls', 'ssl', 'encrypt', 'openssl', 'bouncycastle', 'bcrypt', 'argon', 'sodium'];
    for (const c of sbom.components) {
      const name = (c.name || '').toLowerCase();
      const isCrypto = cryptoKeywords.some(k => name.includes(k));
      if (isCrypto && !c.cryptoProperties && !c.properties?.some(p => p.name?.includes('crypto'))) {
        findings.push({
          severity: 'info',
          component: c.name,
          message: `${c.name} appears cryptographic but lacks crypto properties`
        });
      }
    }
    return findings;
  }
};
