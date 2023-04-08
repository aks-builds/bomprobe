module.exports = {
  id: 'service-data',
  name: 'Service Data',
  description: 'Service components should include endpoint and authentication info',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (c.type !== 'service' && c.type !== 'platform') continue;

      const data = c.data || [];
      const refs = c.externalReferences || [];
      const hasEndpoint = refs.some(r => r.type === 'website' || r.type === 'distribution');

      if (!hasEndpoint) {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `Service '${c.name || 'Unnamed'}' has no endpoint reference`
        });
      }
    }
    return findings;
  }
};
