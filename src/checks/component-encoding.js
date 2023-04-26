module.exports = {
  id: 'component-encoding',
  name: 'Component Encoding Declaration',
  description: 'Components with embedded content should declare encoding',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      const refs = c.externalReferences || [];
      for (const ref of refs) {
        if (ref.type === 'distribution' && ref.hashes?.length && !ref.url) {
          findings.push({
            severity: 'info',
            component: c.name,
            message: `${c.name || 'Unnamed'} has distribution hash but no URL to verify against`
          });
        }
      }

      if (c.data?.length) {
        for (const d of c.data) {
          if (d.contents && !d.encoding) {
            findings.push({
              severity: 'info',
              component: c.name,
              message: `${c.name || 'Unnamed'} has inline data contents without encoding declaration`
            });
          }
        }
      }
    }
    return findings;
  }
};
