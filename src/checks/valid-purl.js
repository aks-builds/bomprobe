const { isValidPurl } = require('../utils/purl');

module.exports = {
  id: 'valid-purl',
  name: 'Valid PURL',
  description: 'Package URLs should follow the purl specification format',
  weight: 0.5,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (c.purl && !isValidPurl(c.purl)) {
        findings.push({
          severity: 'warning',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} has malformed purl: ${c.purl}`
        });
      }
    }
    return findings;
  }
};
