module.exports = {
  id: 'dependency-scope-mismatch',
  name: 'Dependency Scope Mismatch',
  description: 'Components listed in dependencies should not have conflicting scope values',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const scopeMap = new Map();

    for (const c of (sbom.components || [])) {
      if (c['bom-ref'] && c.scope) {
        scopeMap.set(c['bom-ref'], { name: c.name, scope: c.scope });
      }
    }

    for (const dep of (sbom.dependencies || [])) {
      const parent = scopeMap.get(dep.ref);
      if (!parent) continue;

      for (const child of (dep.dependsOn || [])) {
        const childInfo = scopeMap.get(child);
        if (!childInfo) continue;

        if (parent.scope === 'optional' && childInfo.scope === 'required') {
          findings.push({
            severity: 'warning',
            component: childInfo.name,
            message: `${childInfo.name} is 'required' but depended on by optional ${parent.name}`
          });
        }
      }
    }

    return findings;
  }
};
