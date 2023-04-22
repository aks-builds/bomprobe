const NTIA_REQUIRED_FIELDS = [
  'supplier', 'name', 'version', 'uniqueIdentifier', 'dependencies', 'timestamp', 'author'
];

function checkNtia(sbom) {
  const findings = [];
  const components = sbom.components || [];

  if (!sbom.metadata?.timestamp) {
    findings.push({ field: 'timestamp', met: false, detail: 'SBOM missing timestamp' });
  } else {
    findings.push({ field: 'timestamp', met: true });
  }

  if (!sbom.metadata?.authors?.length && !sbom.metadata?.component?.author) {
    findings.push({ field: 'author', met: false, detail: 'SBOM missing author information' });
  } else {
    findings.push({ field: 'author', met: true });
  }

  const hasDeps = (sbom.dependencies || []).length > 0;
  findings.push({ field: 'dependencies', met: hasDeps, detail: hasDeps ? undefined : 'No dependency relationships declared' });

  let missingName = 0;
  let missingVersion = 0;
  let missingSupplier = 0;
  let missingId = 0;

  for (const c of components) {
    if (!c.name) missingName++;
    if (!c.version) missingVersion++;
    if (!c.supplier?.name && !c.author) missingSupplier++;
    if (!c.purl && !c['bom-ref']) missingId++;
  }

  findings.push({ field: 'name', met: missingName === 0, detail: missingName > 0 ? `${missingName} component(s) missing name` : undefined });
  findings.push({ field: 'version', met: missingVersion === 0, detail: missingVersion > 0 ? `${missingVersion} component(s) missing version` : undefined });
  findings.push({ field: 'supplier', met: missingSupplier === 0, detail: missingSupplier > 0 ? `${missingSupplier} component(s) missing supplier` : undefined });
  findings.push({ field: 'uniqueIdentifier', met: missingId === 0, detail: missingId > 0 ? `${missingId} component(s) missing unique identifier` : undefined });

  const metCount = findings.filter(f => f.met).length;
  return {
    profile: 'NTIA Minimum Elements',
    total: NTIA_REQUIRED_FIELDS.length,
    met: metCount,
    score: Math.round((metCount / NTIA_REQUIRED_FIELDS.length) * 100),
    findings
  };
}

module.exports = { checkNtia, NTIA_REQUIRED_FIELDS };
