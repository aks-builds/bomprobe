module.exports = {
  id: 'component-trust-boundary',
  name: 'Component Trust Boundary',
  description: 'Third-party components should have supplier and hash for trust verification',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (c.type === 'data' || c.type === 'file') continue;

      const isThirdParty = c.scope === 'optional' ||
        (!c.group && c.purl && !c.purl.includes(sbom.metadata?.component?.group || '\0'));

      if (!isThirdParty) continue;

      const hasSupplier = !!c.supplier?.name;
      const hasHash = c.hashes?.length > 0;

      if (!hasSupplier && !hasHash) {
        findings.push({
          severity: 'warning',
          component: c.name,
          message: `Third-party component "${c.name || 'Unnamed'}" lacks both supplier and hash for trust verification`
        });
      }
    }
    return findings;
  }
};
