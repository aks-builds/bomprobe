module.exports = {
  id: 'component-version-range',
  name: 'Component Version Range',
  description: 'Components should have exact versions, not ranges or wildcards',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const rangePattern = /[~^*|]/;

    for (const c of (sbom.components || [])) {
      if (!c.version) continue;

      if (rangePattern.test(c.version)) {
        findings.push({
          severity: 'warning',
          component: c.name,
          message: `${c.name || 'unnamed'} has version range instead of exact version: ${c.version}`
        });
      }
    }

    return findings;
  }
};
