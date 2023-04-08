module.exports = {
  id: 'metadata-manufacture',
  name: 'Metadata Manufacture',
  description: 'SBOM should indicate the manufacturing context (manufacture or build lifecycle)',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const meta = sbom.metadata || {};
    const lifecycle = meta.lifecycles || meta.lifecycle || [];
    const hasManufacture = Array.isArray(lifecycle)
      ? lifecycle.some(l => l.phase === 'build' || l.phase === 'post-build')
      : false;

    const hasComponent = !!meta.component;

    if (!hasComponent && !hasManufacture) {
      findings.push({
        severity: 'info',
        message: 'No manufacture or build context in metadata - consider adding metadata.component or lifecycle phase'
      });
    }

    return findings;
  }
};
