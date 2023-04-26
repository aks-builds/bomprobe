const VALID_FORMATS = new Set(['text', 'json', 'markdown', 'csv', 'sarif', 'html', 'github', 'gitlab', 'junit']);
const VALID_FAIL_ON = new Set(['error', 'warning', 'info', 'none']);
const VALID_PRESETS = new Set(['strict', 'moderate', 'minimal', 'ci', 'audit']);

function validateConfigSchema(config) {
  const errors = [];

  if (config.format && !VALID_FORMATS.has(config.format)) {
    errors.push(`Invalid format: ${config.format}`);
  }

  if (config.failOn && !VALID_FAIL_ON.has(config.failOn)) {
    errors.push(`Invalid failOn: ${config.failOn}`);
  }

  if (config.preset && !VALID_PRESETS.has(config.preset)) {
    errors.push(`Invalid preset: ${config.preset}`);
  }

  if (config.threshold !== undefined) {
    const t = Number(config.threshold);
    if (isNaN(t) || t < 0 || t > 100) {
      errors.push(`Threshold must be 0-100, got: ${config.threshold}`);
    }
  }

  if (config.exclude && !Array.isArray(config.exclude)) {
    errors.push('exclude must be an array');
  }

  if (config.only && !Array.isArray(config.only)) {
    errors.push('only must be an array');
  }

  if (config.exclude && config.only) {
    errors.push('Cannot use both exclude and only');
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateConfigSchema, VALID_FORMATS, VALID_FAIL_ON, VALID_PRESETS };
