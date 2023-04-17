const { classify } = require('../utils/licenseClassify');

module.exports = {
  id: 'dependency-license-conflict',
  name: 'Dependency License Conflict',
  description: 'Detect potential license incompatibilities between components',
  weight: 0.3,
  run(sbom) {
    const findings = [];
    const copyleftDeps = [];
    const permissiveDeps = [];

    for (const c of sbom.components) {
      const licenses = c.licenses || [];
      for (const l of licenses) {
        const id = l.license?.id || l.id || '';
        const cat = classify(id);
        if (cat === 'copyleft') copyleftDeps.push({ name: c.name, license: id });
        if (cat === 'permissive') permissiveDeps.push({ name: c.name, license: id });
      }
    }

    if (copyleftDeps.length > 0 && permissiveDeps.length > 0) {
      const copyleftNames = copyleftDeps.map(d => `${d.name} (${d.license})`).slice(0, 5);
      findings.push({
        severity: 'warning',
        message: `Mixed copyleft and permissive licenses detected. Copyleft: ${copyleftNames.join(', ')}. Review for compatibility.`
      });
    }

    const agplDeps = copyleftDeps.filter(d => d.license.startsWith('AGPL'));
    if (agplDeps.length > 0) {
      findings.push({
        severity: 'warning',
        message: `AGPL-licensed dependencies found: ${agplDeps.map(d => d.name).join(', ')}. AGPL requires network-use disclosure.`
      });
    }

    return findings;
  }
};
