const KNOWN_FLAGS = new Set([
  'format', 'preset', 'threshold', 'failOn', 'compliance',
  'exclude', 'only', 'watch', 'diff', 'stats',
  'listChecks', 'listPresets', 'color', 'quiet', 'verbose',
  'version', 'help', 'output', 'config', 'profile'
]);

const KNOWN_SHORT = new Map([
  ['f', 'format'],
  ['p', 'preset'],
  ['t', 'threshold'],
  ['o', 'output'],
  ['q', 'quiet'],
  ['v', 'verbose'],
  ['h', 'help']
]);

function validateArgs(parsed) {
  const warnings = [];
  const errors = [];

  for (const key of Object.keys(parsed.flags)) {
    if (key.length === 1) {
      if (!KNOWN_SHORT.has(key)) {
        warnings.push(`Unknown short flag: -${key}`);
      }
    } else if (!KNOWN_FLAGS.has(key)) {
      warnings.push(`Unknown flag: --${key}`);
    }
  }

  if (parsed.files.length === 0 && !parsed.flags.help && !parsed.flags.version &&
      !parsed.flags.listChecks && !parsed.flags.listPresets) {
    errors.push('No input files specified');
  }

  return { valid: errors.length === 0, errors, warnings };
}

function expandShortFlags(parsed) {
  const expanded = { ...parsed, flags: { ...parsed.flags } };
  for (const [short, long] of KNOWN_SHORT) {
    if (expanded.flags[short] !== undefined) {
      expanded.flags[long] = expanded.flags[short];
      delete expanded.flags[short];
    }
  }
  return expanded;
}

module.exports = { validateArgs, expandShortFlags, KNOWN_FLAGS, KNOWN_SHORT };
