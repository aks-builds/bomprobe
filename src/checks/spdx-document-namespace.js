module.exports = {
  id: 'spdx-document-namespace',
  name: 'SPDX Document Namespace',
  description: 'SPDX documents should have a unique document namespace URI',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    if (sbom.format !== 'spdx') return findings;

    const ns = sbom.documentNamespace || sbom.metadata?.documentNamespace;
    if (!ns) {
      findings.push({
        severity: 'warning',
        message: 'SPDX document is missing documentNamespace'
      });
    } else if (!ns.startsWith('https://') && !ns.startsWith('http://')) {
      findings.push({
        severity: 'info',
        message: 'Document namespace should be a URI'
      });
    }

    return findings;
  }
};
