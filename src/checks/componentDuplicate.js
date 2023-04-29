module.exports = {
  id: 'component-duplicate',
  name: 'Component Duplicate',
  description: 'Flags exact duplicate components (same name, version, and type)',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    const seen = new Map();

    for (const c of (sbom.components || [])) {
      const key = `${c.name || ''}|${c.version || ''}|${c.type || ''}`;
      if (seen.has(key)) {
        findings.push({
          severity: 'warning',
          component: c.name,
          message: `${c.name || 'unnamed'}@${c.version || 'unknown'} appears more than once`
        });
      } else {
        seen.set(key, true);
      }
    }

    return findings;
  }
};
