module.exports = {
  id: 'component-purl-ecosystem',
  name: 'PURL Ecosystem Coverage',
  description: 'Package URL should use a recognized ecosystem type',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const known = new Set(['npm', 'pypi', 'maven', 'nuget', 'gem', 'cargo', 'golang',
      'composer', 'swift', 'cocoapods', 'pub', 'hex', 'cran', 'hackage', 'cpan',
      'deb', 'rpm', 'apk', 'docker', 'oci', 'github', 'bitbucket', 'generic', 'conan']);

    for (const c of (sbom.components || [])) {
      if (!c.purl) continue;
      const match = c.purl.match(/^pkg:([^/]+)\//);
      if (match) {
        const type = match[1].toLowerCase();
        if (!known.has(type)) {
          findings.push({
            severity: 'info',
            component: c.name,
            message: `${c.name} purl uses unrecognized ecosystem type "${type}"`
          });
        }
      }
    }
    return findings;
  }
};
