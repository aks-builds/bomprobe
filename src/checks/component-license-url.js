module.exports = {
  id: 'component-license-url',
  name: 'Component License URL',
  description: 'Components with licenses should have a URL pointing to the license text',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      const licenses = c.licenses || [];
      for (const lic of licenses) {
        const entry = lic.license || lic;
        if (entry.id && !entry.url) {
          findings.push({
            severity: 'info',
            component: c.name,
            message: `${c.name || 'Unnamed'} license ${entry.id} has no URL`
          });
        }
      }
    }
    return findings;
  }
};
