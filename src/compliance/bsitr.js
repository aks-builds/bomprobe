const BSI_REQUIREMENTS = [
  'name', 'version', 'supplier', 'uniqueIdentifier', 'license',
  'dependencies', 'hashIntegrity', 'timestamp', 'toolInfo'
];

function checkBsiTr(sbom) {
  const findings = [];
  const components = sbom.components || [];

  let missingName = 0;
  let missingVersion = 0;
  let missingSupplier = 0;
  let missingId = 0;
  let missingLicense = 0;
  let missingHash = 0;

  for (const c of components) {
    if (!c.name) missingName++;
    if (!c.version) missingVersion++;
    if (!c.supplier?.name && !c.author) missingSupplier++;
    if (!c.purl && !c['bom-ref']) missingId++;
    if (!c.licenses?.length && !c.license) missingLicense++;
    if (!c.hashes?.length) missingHash++;
  }

  findings.push({ field: 'name', met: missingName === 0, detail: missingName > 0 ? `${missingName} component(s) missing name` : undefined });
  findings.push({ field: 'version', met: missingVersion === 0, detail: missingVersion > 0 ? `${missingVersion} component(s) missing version` : undefined });
  findings.push({ field: 'supplier', met: missingSupplier === 0, detail: missingSupplier > 0 ? `${missingSupplier} component(s) missing supplier` : undefined });
  findings.push({ field: 'uniqueIdentifier', met: missingId === 0, detail: missingId > 0 ? `${missingId} component(s) missing unique identifier` : undefined });
  findings.push({ field: 'license', met: missingLicense === 0, detail: missingLicense > 0 ? `${missingLicense} component(s) missing license` : undefined });
  findings.push({ field: 'hashIntegrity', met: missingHash === 0, detail: missingHash > 0 ? `${missingHash} component(s) missing hash for integrity` : undefined });

  const hasDeps = (sbom.dependencies || []).length > 0;
  findings.push({ field: 'dependencies', met: hasDeps, detail: hasDeps ? undefined : 'No dependency relationships declared' });

  const hasTimestamp = !!sbom.metadata?.timestamp;
  findings.push({ field: 'timestamp', met: hasTimestamp, detail: hasTimestamp ? undefined : 'SBOM missing timestamp' });

  const hasTools = (sbom.metadata?.tools || []).length > 0;
  findings.push({ field: 'toolInfo', met: hasTools, detail: hasTools ? undefined : 'No SBOM generation tool declared' });

  const metCount = findings.filter(f => f.met).length;
  return {
    profile: 'BSI TR-03183',
    total: BSI_REQUIREMENTS.length,
    met: metCount,
    score: Math.round((metCount / BSI_REQUIREMENTS.length) * 100),
    findings
  };
}

module.exports = { checkBsiTr, BSI_REQUIREMENTS };
