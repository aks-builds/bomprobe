const { isStale } = require('../utils/bomAge');

module.exports = {
  id: 'bom-freshness',
  name: 'BOM Freshness',
  description: 'SBOM should be generated recently and not be stale',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    const timestamp = sbom.metadata?.timestamp;

    if (!timestamp) {
      findings.push({
        severity: 'warning',
        message: 'No generation timestamp in SBOM metadata'
      });
      return findings;
    }

    if (isStale(timestamp, 180)) {
      findings.push({
        severity: 'warning',
        message: 'SBOM is older than 180 days - consider regenerating'
      });
    } else if (isStale(timestamp, 90)) {
      findings.push({
        severity: 'info',
        message: 'SBOM is older than 90 days - may be outdated'
      });
    }

    return findings;
  }
};
