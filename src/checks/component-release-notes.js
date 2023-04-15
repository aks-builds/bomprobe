module.exports = {
  id: 'component-release-notes',
  name: 'Component Release Notes',
  description: 'Components should link to release notes or changelog',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      const refs = c.externalReferences || [];
      const hasReleaseNotes = refs.some(r =>
        r.type === 'release-notes' || r.type === 'changelog'
      );
      if (!hasReleaseNotes && refs.length > 0) {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} has external refs but no release notes link`
        });
      }
    }
    return findings;
  }
};
