const KNOWN_TYPES = new Set([
  'npm', 'maven', 'pypi', 'nuget', 'gem', 'cargo', 'golang', 'composer',
  'cocoapods', 'swift', 'pub', 'hex', 'cran', 'deb', 'rpm', 'apk',
  'docker', 'oci', 'github', 'bitbucket', 'generic'
]);

module.exports = {
  id: 'purl-type',
  name: 'PURL Type',
  description: 'Component PURLs should use a recognized package type',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (!c.purl) continue;
      const match = c.purl.match(/^pkg:([^/]+)\//);
      if (!match) continue;
      const type = match[1];
      if (!KNOWN_TYPES.has(type)) {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} uses unrecognized PURL type: ${type}`
        });
      }
    }
    return findings;
  }
};
