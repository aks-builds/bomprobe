const copyleft = new Set([
  'GPL-2.0-only', 'GPL-2.0-or-later', 'GPL-3.0-only', 'GPL-3.0-or-later',
  'AGPL-3.0-only', 'AGPL-3.0-or-later', 'LGPL-2.1-only', 'LGPL-2.1-or-later',
  'LGPL-3.0-only', 'LGPL-3.0-or-later', 'MPL-2.0', 'EUPL-1.2', 'CPAL-1.0'
]);

module.exports = {
  id: 'component-dependency-license',
  name: 'Component Dependency License',
  description: 'Flags transitive dependencies that carry copyleft licenses',
  weight: 0.2,
  run(sbom) {
    const findings = [];

    for (const c of (sbom.components || [])) {
      if (c.scope === 'required' || !c.scope) {
        const licId = c.licenses?.[0]?.license?.id
          || c.licenses?.[0]?.id;
        if (licId && copyleft.has(licId)) {
          findings.push({
            severity: 'warning',
            component: c.name,
            message: `${c.name || 'unnamed'} carries copyleft license ${licId}`
          });
        }
      }
    }

    return findings;
  }
};
