module.exports = {
  id: 'component-scope',
  name: 'Component Scope',
  description: 'Components should declare their scope (required, optional, etc)',
  weight: 0.3,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (!c.scope) {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed component'} has no scope declared`
        });
      }
    }
    return findings;
  }
};
