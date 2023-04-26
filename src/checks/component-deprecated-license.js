const DEPRECATED = new Set([
  'GPL-2.0', 'GPL-3.0', 'LGPL-2.0', 'LGPL-2.1', 'LGPL-3.0',
  'AGPL-1.0', 'AGPL-3.0', 'GFDL-1.1', 'GFDL-1.2', 'GFDL-1.3',
  'BSD-2-Clause-FreeBSD', 'BSD-2-Clause-NetBSD',
  'Nunit', 'StandardML-NJ', 'wxWindows'
]);

module.exports = {
  id: 'component-deprecated-license',
  name: 'Component Deprecated SPDX License',
  description: 'Flags components using deprecated SPDX license identifiers',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      const licenses = c.licenses || [];
      for (const lic of licenses) {
        const id = lic.license?.id || lic.id || '';
        if (DEPRECATED.has(id)) {
          findings.push({
            severity: 'info',
            component: c.name,
            message: `${c.name || 'Unnamed'} uses deprecated SPDX identifier "${id}"`
          });
        }
      }
    }
    return findings;
  }
};
