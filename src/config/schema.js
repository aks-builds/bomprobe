const VALID_FORMATS = ['json', 'text', 'markdown', 'csv', 'sarif'];
const VALID_GRADES = ['A', 'B', 'C', 'D', 'F'];

function validateConfig(config) {
  const errors = [];

  if (config.format && !VALID_FORMATS.includes(config.format)) {
    errors.push(`Invalid format "${config.format}". Must be one of: ${VALID_FORMATS.join(', ')}`);
  }

  if (config.failOn) {
    if (!VALID_GRADES.includes(config.failOn)) {
      errors.push(`Invalid failOn grade "${config.failOn}". Must be one of: ${VALID_GRADES.join(', ')}`);
    }
  }

  if (config.threshold !== undefined) {
    if (typeof config.threshold !== 'number' || config.threshold < 0 || config.threshold > 100) {
      errors.push('threshold must be a number between 0 and 100');
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

  if (config.weights) {
    if (typeof config.weights !== 'object' || Array.isArray(config.weights)) {
      errors.push('weights must be an object');
    } else {
      for (const [k, v] of Object.entries(config.weights)) {
        if (typeof v !== 'number' || v < 0 || v > 1) {
          errors.push(`Weight for "${k}" must be a number between 0 and 1`);
        }
      }
    }
  }

  if (config.compliance) {
    if (typeof config.compliance !== 'string') {
      errors.push('compliance must be a profile name string');
    }
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateConfig, VALID_FORMATS, VALID_GRADES };
