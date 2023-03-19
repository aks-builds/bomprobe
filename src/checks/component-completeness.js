const NTIA_FIELDS = ['name', 'version', 'supplier', 'purl'];

module.exports = {
  id: 'component-completeness',
  name: 'Component Completeness',
  description: 'Each component should have all NTIA minimum element fields populated',
  weight: 0.6,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      const missing = NTIA_FIELDS.filter(f => !c[f]);
      if (missing.length > 0) {
        const pct = Math.round(((NTIA_FIELDS.length - missing.length) / NTIA_FIELDS.length) * 100);
        findings.push({
          severity: missing.length >= 3 ? 'error' : missing.length >= 2 ? 'warning' : 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} is ${pct}% complete, missing: ${missing.join(', ')}`
        });
      }
    }
    return findings;
  }
};
