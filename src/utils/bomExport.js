function exportComponentList(sbom, format) {
  const components = sbom.components || [];
  if (format === 'csv') return exportCsv(components);
  if (format === 'json') return JSON.stringify(components, null, 2);
  return exportText(components);
}

function exportCsv(components) {
  const header = 'name,version,type,purl,license,supplier';
  const rows = components.map(c => {
    const license = extractLicense(c);
    return [
      csvEscape(c.name || ''),
      csvEscape(c.version || ''),
      csvEscape(c.type || ''),
      csvEscape(c.purl || ''),
      csvEscape(license),
      csvEscape(c.supplier?.name || '')
    ].join(',');
  });
  return [header, ...rows].join('\n');
}

function exportText(components) {
  return components.map(c => {
    const parts = [c.name || 'unnamed'];
    if (c.version) parts.push(`@${c.version}`);
    if (c.type) parts.push(`(${c.type})`);
    return parts.join('');
  }).join('\n');
}

function extractLicense(component) {
  const lic = component.licenses?.[0];
  if (!lic) return '';
  return lic.license?.id || lic.expression || lic.id || '';
}

function csvEscape(val) {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

module.exports = { exportComponentList, exportCsv, exportText };
