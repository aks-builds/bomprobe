module.exports = {
  id: 'component-license-notice',
  name: 'License Notice Text',
  description: 'Components with non-standard licenses should include notice text',
  weight: 0.1,
  run(sbom) {
    const findings = [];
    const standardIds = new Set(['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause',
      'ISC', 'Zlib', 'Unlicense', '0BSD', 'CC0-1.0', 'GPL-2.0-only', 'GPL-2.0-or-later',
      'GPL-3.0-only', 'GPL-3.0-or-later', 'LGPL-2.1-only', 'LGPL-3.0-only', 'MPL-2.0',
      'AGPL-3.0-only', 'AGPL-3.0-or-later', 'EPL-2.0', 'CDDL-1.0', 'Artistic-2.0']);

    for (const c of (sbom.components || [])) {
      if (!Array.isArray(c.licenses)) continue;
      for (const l of c.licenses) {
        const id = l.license?.id || l.expression;
        if (id && !standardIds.has(id) && !l.license?.text) {
          findings.push({
            severity: 'info',
            component: c.name,
            message: `${c.name} uses non-standard license "${id}" without notice text`
          });
        }
      }
    }
    return findings;
  }
};
