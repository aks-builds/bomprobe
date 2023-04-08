module.exports = {
  id: 'component-group',
  name: 'Component Group',
  description: 'Components should specify their group/namespace for disambiguation',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (!c.group && !c.namespace && c.type === 'library') {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} library has no group/namespace`
        });
      }
    }
    return findings;
  }
};
