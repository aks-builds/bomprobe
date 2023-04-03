const { parsePurl } = require('../utils/purl');

module.exports = {
  id: 'component-namespace',
  name: 'Component Namespace',
  description: 'Components with PURLs should include a namespace for disambiguation',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (!c.purl) continue;
      const parsed = parsePurl(c.purl);
      if (parsed && !parsed.namespace) {
        const type = parsed.type;
        if (type === 'maven' || type === 'golang' || type === 'composer') {
          findings.push({
            severity: 'warning',
            component: c.name || 'unnamed',
            message: `${c.name || 'Unnamed'} PURL (${type}) is missing a namespace`
          });
        }
      }
    }
    return findings;
  }
};
