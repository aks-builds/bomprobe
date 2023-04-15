module.exports = {
  id: 'component-mime',
  name: 'Component MIME Type',
  description: 'Components should specify a MIME type for binary or non-standard assets',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const binaryTypes = new Set(['firmware', 'device', 'file', 'container']);
    for (const c of sbom.components) {
      const type = (c.type || '').toLowerCase();
      if (binaryTypes.has(type) && !c.mime && !c.mimeType) {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} ${type} component has no MIME type`
        });
      }
    }
    return findings;
  }
};
