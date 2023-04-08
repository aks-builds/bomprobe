const COPYLEFT = new Set([
  'GPL-2.0-only', 'GPL-2.0-or-later', 'GPL-3.0-only', 'GPL-3.0-or-later',
  'AGPL-3.0-only', 'AGPL-3.0-or-later', 'LGPL-2.1-only', 'LGPL-2.1-or-later',
  'LGPL-3.0-only', 'LGPL-3.0-or-later', 'MPL-2.0', 'EUPL-1.2',
  'CPAL-1.0', 'OSL-3.0', 'EPL-2.0', 'CECILL-2.1'
]);

const PERMISSIVE = new Set([
  'MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC',
  'Zlib', 'Unlicense', 'CC0-1.0', '0BSD', 'BlueOak-1.0.0',
  'BSL-1.0', 'MIT-0', 'PostgreSQL', 'X11', 'WTFPL'
]);

const PROPRIETARY_INDICATORS = ['proprietary', 'commercial', 'unlicensed'];

function classify(licenseId) {
  if (!licenseId) return 'unknown';
  const id = licenseId.trim();
  if (COPYLEFT.has(id)) return 'copyleft';
  if (PERMISSIVE.has(id)) return 'permissive';
  if (PROPRIETARY_INDICATORS.some(p => id.toLowerCase().includes(p))) return 'proprietary';
  return 'other';
}

function classifyComponents(components) {
  const counts = { copyleft: 0, permissive: 0, proprietary: 0, other: 0, unknown: 0 };
  for (const c of components) {
    const license = c.license || c.licenses?.[0]?.license?.id || c.licenses?.[0]?.expression || null;
    const cat = classify(license);
    counts[cat]++;
  }
  return counts;
}

module.exports = { classify, classifyComponents, COPYLEFT, PERMISSIVE };
