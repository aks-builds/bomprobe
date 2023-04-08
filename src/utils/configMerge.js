function mergeConfig(...configs) {
  const merged = {};
  for (const config of configs) {
    if (!config) continue;
    for (const [key, value] of Object.entries(config)) {
      if (Array.isArray(value) && Array.isArray(merged[key])) {
        merged[key] = [...merged[key], ...value];
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        merged[key] = mergeConfig(merged[key] || {}, value);
      } else {
        merged[key] = value;
      }
    }
  }
  return merged;
}

function resolveConfig(fileConfig, cliFlags) {
  const defaults = {
    format: 'text',
    failOn: 'error',
    exclude: [],
    only: null,
    compliance: null,
    minScore: 0
  };
  return mergeConfig(defaults, fileConfig, cliFlags);
}

module.exports = { mergeConfig, resolveConfig };
