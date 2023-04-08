module.exports = {
  id: 'component-patch-diff',
  name: 'Component Patch Diff',
  description: 'Patched components should include diff references for auditability',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      const pedigree = c.pedigree || {};
      const patches = pedigree.patches || [];

      for (const patch of patches) {
        const diffs = patch.resolves || patch.diff || {};
        if (!diffs.url && !diffs.text) {
          findings.push({
            severity: 'info',
            component: c.name || 'unnamed',
            message: `${c.name || 'Unnamed'} has a patch without diff reference`
          });
        }
      }
    }
    return findings;
  }
};
