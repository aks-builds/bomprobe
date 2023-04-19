module.exports = {
  id: 'component-patch-status',
  name: 'Component Patch Status',
  description: 'Components with known patches should reference the applied patches',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (c.pedigree?.patches && c.pedigree.patches.length > 0) {
        for (const patch of c.pedigree.patches) {
          if (!patch.type) {
            findings.push({
              severity: 'info',
              component: c.name || 'unnamed',
              message: `${c.name || 'Unnamed'} has a patch without a type classification`
            });
          }
        }
      }
    }
    return findings;
  }
};
