const presets = {
  strict: {
    threshold: 90,
    failOn: 'warning',
    exclude: []
  },
  moderate: {
    threshold: 60,
    failOn: 'error',
    exclude: []
  },
  minimal: {
    threshold: 30,
    failOn: 'error',
    exclude: ['component-description', 'component-copyright', 'component-evidence']
  },
  ci: {
    threshold: 70,
    failOn: 'error',
    format: 'json',
    quiet: true
  },
  audit: {
    threshold: 0,
    failOn: 'none',
    format: 'markdown'
  }
};

function getPreset(name) {
  return presets[name] || null;
}

function listPresets() {
  return Object.keys(presets).map(name => ({
    name,
    threshold: presets[name].threshold,
    failOn: presets[name].failOn
  }));
}

function applyPreset(presetName, overrides = {}) {
  const base = getPreset(presetName);
  if (!base) return overrides;
  return { ...base, ...overrides };
}

module.exports = { getPreset, listPresets, applyPreset };
