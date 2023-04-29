function mergeConfigChain(envConfig, fileConfig, cliConfig) {
  const base = {};

  applyLayer(base, envConfig);
  applyLayer(base, fileConfig);
  applyLayer(base, cliConfig);

  return base;
}

function applyLayer(target, source) {
  if (!source || typeof source !== 'object') return;

  for (const [key, val] of Object.entries(source)) {
    if (val === undefined) continue;

    if (Array.isArray(val)) {
      target[key] = [...val];
    } else if (typeof val === 'object' && val !== null) {
      target[key] = target[key] || {};
      applyLayer(target[key], val);
    } else {
      target[key] = val;
    }
  }
}

function describeConfig(config) {
  const lines = [];
  for (const [key, val] of Object.entries(config)) {
    if (val === undefined) continue;
    lines.push(`  ${key}: ${JSON.stringify(val)}`);
  }
  return lines.length > 0 ? lines.join('\n') : '  (empty)';
}

module.exports = { mergeConfigChain, describeConfig };
