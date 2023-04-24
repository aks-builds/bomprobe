const PRESETS = {
  strict: {
    failOn: 'warning',
    threshold: 80,
    format: 'text',
    compliance: ['ntia', 'eucra', 'bsitr']
  },
  moderate: {
    failOn: 'error',
    threshold: 60,
    format: 'text',
    compliance: ['ntia']
  },
  minimal: {
    failOn: 'error',
    threshold: 0,
    format: 'text',
    compliance: []
  },
  ci: {
    failOn: 'error',
    threshold: 70,
    format: 'sarif',
    compliance: ['ntia']
  },
  audit: {
    failOn: 'any',
    threshold: 90,
    format: 'json',
    compliance: ['ntia', 'eucra', 'bsitr']
  }
};

function getPreset(name) {
  return PRESETS[name] || null;
}

function listPresets() {
  return Object.entries(PRESETS).map(([id, config]) => ({
    id,
    failOn: config.failOn,
    threshold: config.threshold,
    format: config.format,
    complianceProfiles: config.compliance.length
  }));
}

function mergePreset(presetName, overrides) {
  const preset = getPreset(presetName);
  if (!preset) return overrides || {};
  return { ...preset, ...overrides };
}

module.exports = { getPreset, listPresets, mergePreset, PRESETS };
