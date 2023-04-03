module.exports = {
  id: 'metadata-document-namespace',
  name: 'Metadata Document Namespace',
  description: 'The SBOM should have a unique document namespace or serial number',
  weight: 0.3,
  run(sbom) {
    const findings = [];
    const ns = sbom.metadata.documentNamespace;
    const serial = sbom.metadata.serialNumber;

    if (!ns && !serial) {
      findings.push({
        severity: 'error',
        message: 'SBOM has no document namespace or serial number for unique identification'
      });
      return findings;
    }

    if (ns && !ns.startsWith('http') && !ns.includes('://')) {
      findings.push({
        severity: 'warning',
        message: 'Document namespace is not a valid URI'
      });
    }

    return findings;
  }
};
