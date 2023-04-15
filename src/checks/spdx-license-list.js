const SPDX_LICENSE_LIST_VERSION = '3.21';

const COMMON_SPDX_IDS = new Set([
  'MIT', 'Apache-2.0', 'GPL-2.0-only', 'GPL-2.0-or-later',
  'GPL-3.0-only', 'GPL-3.0-or-later', 'BSD-2-Clause', 'BSD-3-Clause',
  'ISC', 'MPL-2.0', 'LGPL-2.1-only', 'LGPL-2.1-or-later',
  'LGPL-3.0-only', 'LGPL-3.0-or-later', 'AGPL-3.0-only', 'AGPL-3.0-or-later',
  'Unlicense', 'CC0-1.0', 'CC-BY-4.0', 'CC-BY-SA-4.0',
  '0BSD', 'BSL-1.0', 'Zlib', 'PSF-2.0', 'MIT-0',
  'EUPL-1.2', 'EPL-2.0', 'CDDL-1.0', 'Artistic-2.0',
  'PostgreSQL', 'WTFPL', 'BlueOak-1.0.0', 'ECL-2.0'
]);

module.exports = {
  id: 'spdx-license-list',
  name: 'SPDX License List Validation',
  description: 'License identifiers should be valid SPDX license list entries',
  weight: 0.2,
  run(sbom) {
    const findings = [];
    for (const c of sbom.components) {
      const licenses = c.licenses || [];
      for (const l of licenses) {
        const id = l.license?.id || l.id;
        if (id && !COMMON_SPDX_IDS.has(id) && !id.includes(' OR ') && !id.includes(' AND ')) {
          findings.push({
            severity: 'info',
            component: c.name || 'unnamed',
            message: `${c.name || 'Unnamed'} uses uncommon license identifier: ${id}`
          });
        }
      }
    }
    return findings;
  }
};
