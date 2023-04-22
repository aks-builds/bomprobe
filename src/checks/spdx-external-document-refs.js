module.exports = {
  id: 'spdx-external-document-refs',
  name: 'SPDX External Document References',
  description: 'SPDX external document references should include checksum and namespace',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const refs = sbom.externalDocumentRefs || [];

    for (const ref of refs) {
      if (!ref.spdxDocument) {
        findings.push({
          severity: 'warning',
          message: `External document ref "${ref.externalDocumentId || 'unknown'}" missing spdxDocument URI`
        });
      }
      if (!ref.checksum?.checksumValue) {
        findings.push({
          severity: 'info',
          message: `External document ref "${ref.externalDocumentId || 'unknown'}" missing checksum`
        });
      }
    }

    return findings;
  }
};
