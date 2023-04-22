module.exports = {
  id: 'metadata-tool-version',
  name: 'Metadata Tool Version',
  description: 'SBOM generation tools should include version information',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const tools = sbom.metadata?.tools || [];

    for (const tool of tools) {
      if (typeof tool === 'string') continue;
      const name = tool.name || tool.vendor || '';
      if (!tool.version) {
        findings.push({
          severity: 'info',
          message: `Tool "${name || 'unnamed'}" does not specify a version`
        });
      }
    }

    if (tools.length === 0 && sbom.metadata) {
      findings.push({
        severity: 'info',
        message: 'No SBOM generation tools declared in metadata'
      });
    }

    return findings;
  }
};
