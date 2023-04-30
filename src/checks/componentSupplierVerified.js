module.exports = {
  id: 'component-supplier-verified',
  name: 'Supplier Verification',
  description: 'Supplier should have both name and URL for verifiability',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of (sbom.components || [])) {
      if (!c.supplier) continue;
      if (c.supplier.name && !c.supplier.url) {
        findings.push({
          severity: 'info',
          component: c.name,
          message: `${c.name} supplier "${c.supplier.name}" has no URL for verification`
        });
      }
    }
    return findings;
  }
};
