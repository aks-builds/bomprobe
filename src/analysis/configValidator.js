const VALID_FORMATS = ['text', 'json', 'markdown', 'csv', 'sarif', 'html',
  'github-annotations', 'gitlab-code-quality', 'junit', 'badge', 'trend', 'diff'];

const VALID_PROFILES = ['ntia', 'bsi', 'eu-cra'];
const VALID_PRESETS = ['strict', 'moderate', 'minimal', 'ci', 'audit'];

function validateConfig(config) {
  const errors = [];
  const warnings = [];

  if (config.format && !VALID_FORMATS.includes(config.format)) {
    errors.push(`Unknown format "${config.format}". Valid: ${VALID_FORMATS.join(', ')}`);
  }

  if (config.profile && !VALID_PROFILES.includes(config.profile)) {
    errors.push(`Unknown profile "${config.profile}". Valid: ${VALID_PROFILES.join(', ')}`);
  }

  if (config.preset && !VALID_PRESETS.includes(config.preset)) {
    errors.push(`Unknown preset "${config.preset}". Valid: ${VALID_PRESETS.join(', ')}`);
  }

  if (config.threshold !== undefined) {
    const t = Number(config.threshold);
    if (isNaN(t) || t < 0 || t > 100) {
      errors.push(`Threshold must be 0-100, got "${config.threshold}"`);
    }
  }

  if (config.exclude) {
    if (!Array.isArray(config.exclude)) {
      errors.push('exclude must be an array of check IDs');
    }
  }

  if (config.only) {
    if (!Array.isArray(config.only)) {
      errors.push('only must be an array of check IDs');
    }
    if (config.exclude && config.only) {
      warnings.push('Both "exclude" and "only" are set. "only" takes precedence.');
    }
  }

  if (config.failOn) {
    const valid = ['error', 'warning', 'info', 'none'];
    if (!valid.includes(config.failOn)) {
      errors.push(`failOn must be one of: ${valid.join(', ')}`);
    }
  }

  if (config.output && typeof config.output !== 'string') {
    errors.push('output must be a file path string');
  }

  return { valid: errors.length === 0, errors, warnings };
}

function mergeConfigs(...configs) {
  const merged = {};
  for (const c of configs) {
    if (!c || typeof c !== 'object') continue;
    for (const [key, value] of Object.entries(c)) {
      if (value !== undefined && value !== null) {
        merged[key] = value;
      }
    }
  }
  return merged;
}

function formatValidation(result) {
  const lines = [];
  if (result.valid) {
    lines.push('Configuration is valid.');
  } else {
    lines.push('Configuration errors:');
    for (const e of result.errors) lines.push(`  ERROR: ${e}`);
  }
  if (result.warnings.length > 0) {
    lines.push('Warnings:');
    for (const w of result.warnings) lines.push(`  WARN: ${w}`);
  }
  return lines.join('\n');
}

module.exports = { validateConfig, mergeConfigs, formatValidation, VALID_FORMATS, VALID_PROFILES, VALID_PRESETS };
