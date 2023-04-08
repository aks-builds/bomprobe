module.exports = {
  id: 'component-modified',
  name: 'Component Modified',
  description: 'Flags modified or patched components that may differ from upstream',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      const pedigree = c.pedigree || {};
      const patches = pedigree.patches || [];
      if (patches.length > 0) {
        findings.push({
          severity: 'warning',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} has ${patches.length} patch(es) applied`
        });
      }
      if (c.modified === true) {
        findings.push({
          severity: 'warning',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} is marked as modified from upstream`
        });
      }
    }
    return findings;
  }
};
