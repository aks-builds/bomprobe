const knownEcosystems = new Set([
  'npm', 'maven', 'pypi', 'nuget', 'gem', 'cargo', 'go',
  'composer', 'cocoapods', 'swift', 'hex', 'pub', 'cran',
  'hackage', 'cpan', 'conda', 'conan', 'alpine', 'deb', 'rpm'
]);

module.exports = {
  id: 'component-ecosystem',
  name: 'Component Ecosystem',
  description: 'Components with purl should map to a known package ecosystem',
  weight: 0.1,
  run(sbom) {
    const findings = [];

    for (const c of (sbom.components || [])) {
      if (!c.purl) continue;

      const match = c.purl.match(/^pkg:([^/]+)\//);
      if (!match) continue;

      const eco = match[1].toLowerCase();
      if (!knownEcosystems.has(eco)) {
        findings.push({
          severity: 'info',
          component: c.name,
          message: `${c.name} uses unknown ecosystem: ${eco}`
        });
      }
    }

    return findings;
  }
};
