const KNOWN_LICENSES = new Set([
  'MIT', 'Apache-2.0', 'GPL-2.0-only', 'GPL-2.0-or-later', 'GPL-3.0-only',
  'GPL-3.0-or-later', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC', 'MPL-2.0',
  'LGPL-2.1-only', 'LGPL-2.1-or-later', 'LGPL-3.0-only', 'LGPL-3.0-or-later',
  'CDDL-1.0', 'EPL-1.0', 'EPL-2.0', 'Unlicense', 'CC0-1.0', 'CC-BY-4.0',
  'CC-BY-SA-4.0', '0BSD', 'Artistic-2.0', 'Zlib', 'BSL-1.0', 'PostgreSQL',
  'WTFPL', 'BlueOak-1.0.0'
]);

function isValidExpression(license) {
  if (!license) return true;
  const parts = license.split(/\s+(AND|OR|WITH)\s+/);
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed === 'AND' || trimmed === 'OR' || trimmed === 'WITH') continue;
    if (trimmed.startsWith('LicenseRef-')) continue;
    if (!KNOWN_LICENSES.has(trimmed)) return false;
  }
  return true;
}

module.exports = {
  id: 'license-expression',
  name: 'License Expression',
  description: 'Component licenses should use valid SPDX expressions',
  weight: 0.3,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (c.license && !isValidExpression(c.license)) {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} has non-standard license expression: ${c.license}`
        });
      }
    }
    return findings;
  }
};
