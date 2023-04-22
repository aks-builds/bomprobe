const EU_CRA_REQUIREMENTS = [
  'supplier', 'name', 'version', 'uniqueIdentifier', 'license',
  'vulnerabilityDisclosure', 'updateMechanism', 'dependencies'
];

function checkEuCra(sbom) {
  const findings = [];
  const components = sbom.components || [];

  let missingLicense = 0;
  let missingName = 0;
  let missingVersion = 0;
  let missingSupplier = 0;
  let missingId = 0;

  for (const c of components) {
    if (!c.name) missingName++;
    if (!c.version) missingVersion++;
    if (!c.licenses?.length && !c.license) missingLicense++;
    if (!c.supplier?.name && !c.author) missingSupplier++;
    if (!c.purl && !c['bom-ref']) missingId++;
  }

  findings.push({ field: 'name', met: missingName === 0, detail: missingName > 0 ? `${missingName} component(s) missing name` : undefined });
  findings.push({ field: 'version', met: missingVersion === 0, detail: missingVersion > 0 ? `${missingVersion} component(s) missing version` : undefined });
  findings.push({ field: 'supplier', met: missingSupplier === 0, detail: missingSupplier > 0 ? `${missingSupplier} component(s) missing supplier` : undefined });
  findings.push({ field: 'uniqueIdentifier', met: missingId === 0, detail: missingId > 0 ? `${missingId} component(s) missing unique identifier` : undefined });
  findings.push({ field: 'license', met: missingLicense === 0, detail: missingLicense > 0 ? `${missingLicense} component(s) missing license` : undefined });

  const hasVulnDisclosure = hasProperty(sbom, 'vulnerabilityDisclosure') || hasExternalRef(sbom, 'vcs');
  findings.push({ field: 'vulnerabilityDisclosure', met: hasVulnDisclosure, detail: hasVulnDisclosure ? undefined : 'No vulnerability disclosure process documented' });

  const hasUpdate = hasProperty(sbom, 'updateMechanism') || hasExternalRef(sbom, 'distribution');
  findings.push({ field: 'updateMechanism', met: hasUpdate, detail: hasUpdate ? undefined : 'No update mechanism documented' });

  const hasDeps = (sbom.dependencies || []).length > 0;
  findings.push({ field: 'dependencies', met: hasDeps, detail: hasDeps ? undefined : 'No dependency relationships declared' });

  const metCount = findings.filter(f => f.met).length;
  return {
    profile: 'EU Cyber Resilience Act',
    total: EU_CRA_REQUIREMENTS.length,
    met: metCount,
    score: Math.round((metCount / EU_CRA_REQUIREMENTS.length) * 100),
    findings
  };
}

function hasProperty(sbom, key) {
  const props = sbom.metadata?.properties || [];
  return props.some(p => p.name?.toLowerCase().includes(key.toLowerCase()));
}

function hasExternalRef(sbom, type) {
  const refs = sbom.externalReferences || [];
  return refs.some(r => r.type === type);
}

module.exports = { checkEuCra, EU_CRA_REQUIREMENTS };
