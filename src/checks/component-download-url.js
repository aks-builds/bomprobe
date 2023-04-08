module.exports = {
  id: 'component-download-url',
  name: 'Component Download URL',
  description: 'Components should include a download location or external reference',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      const refs = c.externalReferences || c['external-references'] || [];
      const hasDownload = refs.some(r =>
        r.type === 'distribution' || r.type === 'vcs' || r.type === 'website'
      );
      if (!hasDownload && !c.purl) {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} has no download URL or external reference`
        });
      }
    }
    return findings;
  }
};
