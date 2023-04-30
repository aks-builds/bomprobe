module.exports = {
  id: 'component-namespace-scope',
  name: 'Namespace Scope',
  description: 'Scoped packages should use their namespace consistently in name and purl',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of (sbom.components || [])) {
      if (!c.name || !c.purl) continue;
      const nameHasScope = c.name.startsWith('@') && c.name.includes('/');
      const purlHasScope = c.purl.includes('%40') || c.purl.match(/pkg:[^/]+\/@/);

      if (nameHasScope && !purlHasScope) {
        findings.push({
          severity: 'info',
          component: c.name,
          message: `${c.name} has a namespace scope in name but not in purl`
        });
      }
    }
    return findings;
  }
};
