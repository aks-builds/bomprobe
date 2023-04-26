module.exports = {
  id: 'metadata-bom-version',
  name: 'BOM Version Tracking',
  description: 'CycloneDX BOMs should track version number for change management',
  weight: 0.1,
  run(sbom) {
    const findings = [];

    if (sbom.bomFormat === 'CycloneDX' || sbom.specVersion) {
      const version = sbom.version;
      if (version === undefined || version === null) {
        findings.push({
          severity: 'info',
          message: 'BOM has no version field for change tracking'
        });
      } else if (typeof version === 'number' && version < 1) {
        findings.push({
          severity: 'warning',
          message: `BOM version ${version} should start at 1`
        });
      }
    }

    return findings;
  }
};
