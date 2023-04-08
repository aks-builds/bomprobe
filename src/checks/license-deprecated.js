const DEPRECATED_LICENSES = [
  'GPL-2.0', 'GPL-3.0', 'LGPL-2.0', 'LGPL-2.1', 'LGPL-3.0',
  'AGPL-1.0', 'AGPL-3.0', 'BSD-2-Clause-FreeBSD', 'BSD-2-Clause-NetBSD',
  'eCos-2.0', 'Nunit', 'StandardML-NJ', 'wxWindows'
];

module.exports = {
  id: 'license-deprecated',
  name: 'License Deprecated',
  description: 'Flags components using deprecated SPDX license identifiers',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      if (!c.license) continue;
      const id = typeof c.license === 'object' ? (c.license.id || '') : c.license;
      if (DEPRECATED_LICENSES.includes(id)) {
        findings.push({
          severity: 'info',
          component: c.name || 'unnamed',
          message: `${c.name || 'Unnamed'} uses deprecated license identifier '${id}'`
        });
      }
    }
    return findings;
  }
};
