const { classify } = require('../utils/licenseClassify');

module.exports = {
  id: 'component-license-compatibility',
  name: 'Component License Compatibility',
  description: 'Flags components where parent-child license compatibility is questionable',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    const licenseMap = new Map();

    for (const c of sbom.components) {
      const id = c.purl || c['bom-ref'] || c.name;
      const license = c.licenses?.[0]?.license?.id || c.licenses?.[0]?.expression || c.license || null;
      if (id && license) licenseMap.set(id, { name: c.name, license, category: classify(license) });
    }

    for (const dep of (sbom.dependencies || [])) {
      const parent = licenseMap.get(dep.ref);
      if (!parent) continue;

      for (const child of (dep.dependsOn || [])) {
        const childInfo = licenseMap.get(child);
        if (!childInfo) continue;

        if (parent.category === 'permissive' && childInfo.category === 'copyleft') {
          findings.push({
            severity: 'warning',
            message: `${parent.name} (${parent.license}, permissive) depends on ${childInfo.name} (${childInfo.license}, copyleft)`
          });
        }
      }
    }

    return findings;
  }
};
