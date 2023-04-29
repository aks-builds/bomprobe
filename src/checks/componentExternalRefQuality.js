module.exports = {
  id: 'component-external-ref-quality',
  name: 'External Reference Quality',
  description: 'External references should use HTTPS URLs and have a type classification',
  weight: 0.1,
  run(sbom) {
    const findings = [];

    for (const c of (sbom.components || [])) {
      if (!Array.isArray(c.externalReferences)) continue;

      for (const ref of c.externalReferences) {
        if (!ref.type) {
          findings.push({
            severity: 'info',
            component: c.name,
            message: `${c.name || 'unnamed'} has an external reference without a type classification`
          });
        }

        if (ref.url && ref.url.startsWith('http://')) {
          findings.push({
            severity: 'warning',
            component: c.name,
            message: `${c.name || 'unnamed'} has an HTTP (not HTTPS) external reference: ${ref.url}`
          });
        }
      }
    }

    return findings;
  }
};
