const SPDX_LICENSES = [
  'MIT', 'Apache-2.0', 'GPL-2.0-only', 'GPL-2.0-or-later',
  'GPL-3.0-only', 'GPL-3.0-or-later', 'BSD-2-Clause', 'BSD-3-Clause',
  'ISC', 'MPL-2.0', 'LGPL-2.1-only', 'LGPL-2.1-or-later',
  'LGPL-3.0-only', 'LGPL-3.0-or-later', 'AGPL-3.0-only',
  'AGPL-3.0-or-later', 'Unlicense', '0BSD', 'CC0-1.0',
  'CC-BY-4.0', 'CC-BY-SA-4.0', 'Artistic-2.0', 'Zlib',
  'BSL-1.0', 'EPL-2.0', 'EUPL-1.2', 'PostgreSQL', 'WTFPL',
  'BlueOak-1.0.0', 'CPAL-1.0', 'ECL-2.0', 'EFL-2.0',
  'OSL-3.0', 'OFL-1.1', 'Vim', 'MulanPSL-2.0'
];

const COPYLEFT = [
  'GPL-2.0-only', 'GPL-2.0-or-later', 'GPL-3.0-only', 'GPL-3.0-or-later',
  'AGPL-3.0-only', 'AGPL-3.0-or-later', 'LGPL-2.1-only', 'LGPL-2.1-or-later',
  'LGPL-3.0-only', 'LGPL-3.0-or-later', 'MPL-2.0', 'EPL-2.0',
  'EUPL-1.2', 'OSL-3.0', 'CPAL-1.0', 'CC-BY-SA-4.0'
];

const PERMISSIVE = [
  'MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC',
  'Unlicense', '0BSD', 'CC0-1.0', 'CC-BY-4.0', 'Zlib',
  'BSL-1.0', 'PostgreSQL', 'WTFPL', 'BlueOak-1.0.0',
  'Artistic-2.0', 'OFL-1.1', 'Vim', 'MulanPSL-2.0'
];

function isValidSpdx(id) {
  return SPDX_LICENSES.includes(id);
}

function isCopyleft(id) {
  return COPYLEFT.includes(id);
}

function isPermissive(id) {
  return PERMISSIVE.includes(id);
}

function parseExpression(expr) {
  if (!expr || typeof expr !== 'string') return null;
  const cleaned = expr.trim();
  const parts = cleaned.split(/\s+(AND|OR|WITH)\s+/i);
  const licenses = parts.filter(p => !['AND', 'OR', 'WITH'].includes(p.toUpperCase()));
  const operators = parts.filter(p => ['AND', 'OR', 'WITH'].includes(p.toUpperCase()));
  return { licenses, operators, raw: cleaned };
}

function classify(id) {
  if (isCopyleft(id)) return 'copyleft';
  if (isPermissive(id)) return 'permissive';
  return 'unknown';
}

module.exports = {
  SPDX_LICENSES, COPYLEFT, PERMISSIVE,
  isValidSpdx, isCopyleft, isPermissive,
  parseExpression, classify
};
