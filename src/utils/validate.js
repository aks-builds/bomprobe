function validateSbomStructure(doc) {
  const errors = [];

  if (!doc || typeof doc !== 'object') {
    errors.push('Input is not a valid object');
    return { valid: false, errors };
  }

  if (!doc.components && !doc.packages) {
    errors.push('No components or packages array found');
  }

  if (doc.components && !Array.isArray(doc.components)) {
    errors.push('components must be an array');
  }

  if (doc.packages && !Array.isArray(doc.packages)) {
    errors.push('packages must be an array');
  }

  if (doc.dependencies && !Array.isArray(doc.dependencies)) {
    errors.push('dependencies must be an array');
  }

  if (doc.metadata && typeof doc.metadata !== 'object') {
    errors.push('metadata must be an object');
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateSbomStructure };
