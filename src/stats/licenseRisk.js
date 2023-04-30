const COPYLEFT = new Set([
  'GPL-2.0-only', 'GPL-2.0-or-later', 'GPL-3.0-only', 'GPL-3.0-or-later',
  'AGPL-3.0-only', 'AGPL-3.0-or-later', 'LGPL-2.1-only', 'LGPL-2.1-or-later',
  'LGPL-3.0-only', 'LGPL-3.0-or-later', 'MPL-2.0', 'EUPL-1.2', 'CPAL-1.0',
  'OSL-3.0', 'SSPL-1.0', 'CC-BY-SA-4.0'
]);

const WEAK_COPYLEFT = new Set([
  'LGPL-2.1-only', 'LGPL-2.1-or-later', 'LGPL-3.0-only', 'LGPL-3.0-or-later',
  'MPL-2.0', 'EPL-2.0', 'CPL-1.0'
]);

const PERMISSIVE = new Set([
  'MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC', 'Zlib',
  'Unlicense', '0BSD', 'CC0-1.0', 'Artistic-2.0', 'BSL-1.0', 'PostgreSQL',
  'X11', 'WTFPL'
]);

const COMMERCIAL_RISK = new Set([
  'AGPL-3.0-only', 'AGPL-3.0-or-later', 'SSPL-1.0', 'EUPL-1.2',
  'GPL-3.0-only', 'GPL-3.0-or-later'
]);

function classifyLicense(id) {
  if (!id) return 'unknown';
  if (COMMERCIAL_RISK.has(id)) return 'high-risk';
  if (COPYLEFT.has(id) && !WEAK_COPYLEFT.has(id)) return 'copyleft';
  if (WEAK_COPYLEFT.has(id)) return 'weak-copyleft';
  if (PERMISSIVE.has(id)) return 'permissive';
  return 'unclassified';
}

function analyzeLicenseRisk(sbom) {
  const components = sbom.components || [];
  const risks = [];

  const categories = { 'high-risk': [], copyleft: [], 'weak-copyleft': [], permissive: [], unknown: [], unclassified: [] };
  let unlicensed = 0;

  for (const c of components) {
    const lics = [];
    if (Array.isArray(c.licenses)) {
      for (const l of c.licenses) {
        if (l.license?.id) lics.push(l.license.id);
        else if (l.expression) lics.push(l.expression);
      }
    }

    if (lics.length === 0) {
      unlicensed++;
      categories.unknown.push(c.name);
      continue;
    }

    for (const id of lics) {
      const cat = classifyLicense(id);
      categories[cat].push(`${c.name} (${id})`);

      if (cat === 'high-risk') {
        risks.push({
          severity: 'error',
          component: c.name,
          license: id,
          message: `${c.name} uses ${id}, which has strong copyleft or network-use obligations`
        });
      } else if (cat === 'copyleft') {
        risks.push({
          severity: 'warning',
          component: c.name,
          license: id,
          message: `${c.name} uses copyleft license ${id}, which requires derivative work disclosure`
        });
      }
    }
  }

  const conflictPairs = detectConflicts(components);

  return {
    summary: {
      total: components.length,
      unlicensed,
      highRisk: categories['high-risk'].length,
      copyleft: categories.copyleft.length,
      weakCopyleft: categories['weak-copyleft'].length,
      permissive: categories.permissive.length,
      unclassified: categories.unclassified.length
    },
    categories,
    risks,
    conflicts: conflictPairs
  };
}

function detectConflicts(components) {
  const conflicts = [];
  const licMap = {};

  for (const c of components) {
    if (!Array.isArray(c.licenses)) continue;
    for (const l of c.licenses) {
      const id = l.license?.id || l.expression;
      if (!id) continue;
      if (!licMap[id]) licMap[id] = [];
      licMap[id].push(c.name);
    }
  }

  const gpl3 = ['GPL-3.0-only', 'GPL-3.0-or-later', 'AGPL-3.0-only', 'AGPL-3.0-or-later'];
  const gpl2Only = ['GPL-2.0-only'];

  const hasGpl3 = gpl3.some(l => licMap[l]?.length > 0);
  const hasGpl2Only = gpl2Only.some(l => licMap[l]?.length > 0);

  if (hasGpl3 && hasGpl2Only) {
    conflicts.push({
      type: 'gpl-version-conflict',
      message: 'GPL-2.0-only and GPL-3.0 components cannot be combined in a single binary',
      components: [
        ...gpl2Only.flatMap(l => (licMap[l] || []).map(n => `${n} (${l})`)),
        ...gpl3.flatMap(l => (licMap[l] || []).map(n => `${n} (${l})`))
      ]
    });
  }

  return conflicts;
}

function formatLicenseRisk(result) {
  const lines = [];
  const s = result.summary;

  lines.push('License Risk Analysis');
  lines.push('=====================');
  lines.push(`Total: ${s.total} components`);
  lines.push(`  High-risk:    ${s.highRisk}`);
  lines.push(`  Copyleft:     ${s.copyleft}`);
  lines.push(`  Weak copyleft: ${s.weakCopyleft}`);
  lines.push(`  Permissive:   ${s.permissive}`);
  lines.push(`  Unlicensed:   ${s.unlicensed}`);
  lines.push(`  Unclassified: ${s.unclassified}`);
  lines.push('');

  if (result.risks.length > 0) {
    lines.push('Findings:');
    for (const r of result.risks) lines.push(`  [${r.severity}] ${r.message}`);
    lines.push('');
  }

  if (result.conflicts.length > 0) {
    lines.push('License conflicts:');
    for (const c of result.conflicts) {
      lines.push(`  ${c.type}: ${c.message}`);
      for (const comp of c.components) lines.push(`    - ${comp}`);
    }
  }

  return lines.join('\n');
}

module.exports = { analyzeLicenseRisk, classifyLicense, formatLicenseRisk, detectConflicts };
