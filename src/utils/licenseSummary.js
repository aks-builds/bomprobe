const { classify, parseExpression } = require('./license');

function summarizeLicenses(sbom) {
  const counts = { copyleft: 0, permissive: 0, unknown: 0, none: 0 };
  const licenseMap = {};

  for (const c of sbom.components) {
    if (!c.license) {
      counts.none++;
      continue;
    }

    const parsed = parseExpression(c.license);
    if (!parsed) {
      counts.unknown++;
      continue;
    }

    for (const lic of parsed.licenses) {
      const type = classify(lic);
      counts[type]++;
      if (!licenseMap[lic]) licenseMap[lic] = { count: 0, type };
      licenseMap[lic].count++;
    }
  }

  const sorted = Object.entries(licenseMap)
    .sort((a, b) => b[1].count - a[1].count);

  return {
    total: sbom.components.length,
    counts,
    licenses: sorted.map(([id, info]) => ({ id, ...info }))
  };
}

module.exports = { summarizeLicenses };
