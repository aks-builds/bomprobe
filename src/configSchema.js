const VALID_KEYS = [
  'exclude', 'only', 'profile', 'minScore', 'failOn',
  'format', 'output', 'quiet', 'profiles', 'severity'
];

const VALID_SEVERITIES = ['error', 'warning', 'info'];
const VALID_FORMATS = ['text', 'json', 'markdown', 'csv', 'summary', 'sarif', 'html', 'junit'];

function validateConfig(config) {
  const errors = [];

  if (typeof config !== 'object' || config === null) {
    return { valid: false, errors: ['Config must be a JSON object'] };
  }

  for (const key of Object.keys(config)) {
    if (!VALID_KEYS.includes(key)) {
      errors.push(`Unknown config key: "${key}"`);
    }
  }

  if (config.exclude && !Array.isArray(config.exclude)) {
    errors.push('"exclude" must be an array of check IDs');
  }

  if (config.only && !Array.isArray(config.only)) {
    errors.push('"only" must be an array of check IDs');
  }

  if (config.minScore !== undefined) {
    if (typeof config.minScore !== 'number' || config.minScore < 0 || config.minScore > 10) {
      errors.push('"minScore" must be a number between 0 and 10');
    }
  }

  if (config.failOn && !VALID_SEVERITIES.includes(config.failOn)) {
    errors.push(`"failOn" must be one of: ${VALID_SEVERITIES.join(', ')}`);
  }

  if (config.format && !VALID_FORMATS.includes(config.format)) {
    errors.push(`"format" must be one of: ${VALID_FORMATS.join(', ')}`);
  }

  if (config.profiles && typeof config.profiles !== 'object') {
    errors.push('"profiles" must be an object');
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateConfig, VALID_KEYS, VALID_SEVERITIES, VALID_FORMATS };
