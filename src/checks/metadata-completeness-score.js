module.exports = {
  id: 'metadata-completeness-score',
  name: 'Metadata Completeness Score',
  description: 'Metadata should include timestamp, tools, authors, and component for a complete BOM',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    const meta = sbom.metadata;
    if (!meta) {
      findings.push({ severity: 'error', message: 'No metadata section found' });
      return findings;
    }

    const fields = [
      ['timestamp', meta.timestamp],
      ['tools', meta.tools?.length > 0],
      ['authors', meta.authors?.length > 0 || meta.manufacture],
      ['component', meta.component?.name]
    ];

    let present = 0;
    for (const [name, val] of fields) {
      if (val) {
        present++;
      } else {
        findings.push({
          severity: 'info',
          message: `Metadata missing ${name}`
        });
      }
    }

    if (present < 2) {
      findings.push({
        severity: 'warning',
        message: `Metadata completeness is low: ${present}/${fields.length} fields present`
      });
    }

    return findings;
  }
};
