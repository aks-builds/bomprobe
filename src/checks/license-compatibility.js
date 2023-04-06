const { parseExpression, classify } = require('../utils/license');

module.exports = {
  id: 'license-compatibility',
  name: 'License Compatibility',
  description: 'Components should not mix incompatible copyleft and permissive licenses',
  weight: 0.4,
  run(sbom) {
    const findings = [];
    const types = { copyleft: [], permissive: [], unknown: [] };

    for (const c of sbom.components) {
      if (!c.license) continue;
      const parsed = parseExpression(c.license);
      if (!parsed) continue;

      for (const lic of parsed.licenses) {
        const type = classify(lic);
        types[type].push({ component: c.name, license: lic });
      }
    }

    if (types.copyleft.length > 0 && types.permissive.length > 0) {
      findings.push({
        severity: 'warning',
        message: `Mixed license types: ${types.copyleft.length} copyleft and ${types.permissive.length} permissive components detected`
      });
    }

    const copyleftFamilies = new Set();
    for (const entry of types.copyleft) {
      const family = entry.license.replace(/-only|-or-later/g, '').replace(/-\d+\.\d+.*/, '');
      copyleftFamilies.add(family);
    }
    if (copyleftFamilies.size > 1) {
      findings.push({
        severity: 'error',
        message: `Multiple copyleft families detected: ${[...copyleftFamilies].join(', ')} may be incompatible`
      });
    }

    return findings;
  }
};
