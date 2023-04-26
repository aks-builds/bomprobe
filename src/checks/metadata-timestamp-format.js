const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

module.exports = {
  id: 'metadata-timestamp-format',
  name: 'Metadata Timestamp Format',
  description: 'Timestamps should follow ISO 8601 format and be valid dates',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const ts = sbom.metadata?.timestamp;

    if (!ts) return findings;

    if (!ISO_PATTERN.test(ts)) {
      findings.push({
        severity: 'warning',
        message: `Timestamp "${ts}" does not follow ISO 8601 format`
      });
      return findings;
    }

    const parsed = new Date(ts);
    if (Number.isNaN(parsed.getTime())) {
      findings.push({
        severity: 'error',
        message: `Timestamp "${ts}" is not a valid date`
      });
      return findings;
    }

    if (parsed.getTime() > Date.now() + 86400000) {
      findings.push({
        severity: 'warning',
        message: 'BOM timestamp is more than 24 hours in the future'
      });
    }

    return findings;
  }
};
