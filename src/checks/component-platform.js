const KNOWN_PLATFORMS = new Set([
  'linux', 'windows', 'macos', 'darwin', 'freebsd', 'android', 'ios',
  'x86', 'x86_64', 'amd64', 'arm', 'arm64', 'aarch64', 'ppc64',
  'any', 'universal', 'platform-independent'
]);

module.exports = {
  id: 'component-platform',
  name: 'Component Platform Declaration',
  description: 'Components with platform properties should use recognized values',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      const props = c.properties || [];
      for (const p of props) {
        if (p.name?.toLowerCase().includes('platform') || p.name?.toLowerCase().includes('os') || p.name?.toLowerCase().includes('arch')) {
          const val = (p.value || '').toLowerCase();
          if (val && !KNOWN_PLATFORMS.has(val)) {
            findings.push({
              severity: 'info',
              component: c.name,
              message: `${c.name || 'Unnamed'} declares unrecognized platform "${p.value}"`
            });
          }
        }
      }
    }
    return findings;
  }
};
