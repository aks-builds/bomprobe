const VALID_FORMATS = new Set(['text', 'json', 'markdown', 'csv', 'sarif', 'html', 'github', 'gitlab', 'junit']);
const VALID_FAIL_ON = new Set(['error', 'warning', 'any', 'none']);
const VALID_PROFILES = new Set(['ntia', 'eu-cra', 'eucra', 'bsi-tr', 'bsitr', 'bsi-tr-03183']);

function validateConfig(config) {
  const errors = [];

  if (config.format && !VALID_FORMATS.has(config.format)) {
    errors.push(`Unknown output format "${config.format}". Valid: ${[...VALID_FORMATS].join(', ')}`);
  }

  if (config.failOn && !VALID_FAIL_ON.has(config.failOn)) {
    errors.push(`Unknown failOn value "${config.failOn}". Valid: ${[...VALID_FAIL_ON].join(', ')}`);
  }

  if (config.threshold !== undefined) {
    const t = Number(config.threshold);
    if (Number.isNaN(t) || t < 0 || t > 100) {
      errors.push(`Threshold must be a number between 0 and 100, got "${config.threshold}"`);
    }
  }

  if (config.complianceProfiles) {
    for (const p of config.complianceProfiles) {
      if (!VALID_PROFILES.has(p.toLowerCase())) {
        errors.push(`Unknown compliance profile "${p}". Valid: ${[...VALID_PROFILES].join(', ')}`);
      }
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
  }

  if (config.exclude && config.only) {
    errors.push('Cannot use both "exclude" and "only" at the same time');
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateConfig, VALID_FORMATS, VALID_FAIL_ON, VALID_PROFILES };
