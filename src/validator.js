function validate(sbom) {
  const errors = [];

  if (!sbom.format) {
    errors.push('Missing format field');
  }

  if (!sbom.metadata) {
    errors.push('Missing metadata object');
  }

  if (!Array.isArray(sbom.components)) {
    errors.push('Components must be an array');
  } else {
    for (let i = 0; i < sbom.components.length; i++) {
      const c = sbom.components[i];
      if (!c.name && !c.purl) {
        errors.push(`Component at index ${i} has neither name nor purl`);
      }
    }
  }

  if (!sbom.dependencyGraph) {
    errors.push('Missing dependency graph');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = { validate };
