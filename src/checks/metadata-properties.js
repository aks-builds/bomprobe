module.exports = {
  id: 'metadata-properties',
  name: 'Metadata Properties',
  description: 'Metadata should include custom properties for build reproducibility',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const meta = sbom.metadata || {};
    const props = meta.properties || [];

    if (props.length === 0) {
      findings.push({
        severity: 'info',
        message: 'No custom properties in metadata - consider adding build info, CI pipeline URL, or source commit'
      });
    }

    return findings;
  }
};
