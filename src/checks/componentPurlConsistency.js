module.exports = {
  id: 'component-purl-consistency',
  name: 'PURL Consistency',
  description: 'Package URL should be consistent with the component name and version',
  weight: 0.1,
  run(sbom) {
    const findings = [];

    for (const c of (sbom.components || [])) {
      if (!c.purl || !c.name) continue;

      const purl = c.purl;
      const nameLower = c.name.toLowerCase();

      if (!purl.includes(nameLower) && !purl.includes(encodeURIComponent(nameLower))) {
        const purlName = purl.split('/').pop()?.split('@')[0] || '';
        if (purlName.toLowerCase() !== nameLower) {
          findings.push({
            severity: 'warning',
            component: c.name,
            message: `${c.name} purl (${purl}) doesn't match component name`
          });
        }
      }

      if (c.version && !purl.includes(c.version)) {
        findings.push({
          severity: 'info',
          component: c.name,
          message: `${c.name} purl doesn't include version ${c.version}`
        });
      }
    }

    return findings;
  }
};
