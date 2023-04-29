const envMap = {
  BOMPROBE_FORMAT: 'format',
  BOMPROBE_THRESHOLD: 'threshold',
  BOMPROBE_FAIL_ON: 'failOn',
  BOMPROBE_PRESET: 'preset',
  BOMPROBE_QUIET: 'quiet',
  BOMPROBE_OUTPUT: 'output'
};

function loadEnvConfig() {
  const config = {};

  for (const [envKey, configKey] of Object.entries(envMap)) {
    const val = process.env[envKey];
    if (val === undefined) continue;

    if (configKey === 'threshold') {
      config[configKey] = Number(val);
    } else if (configKey === 'quiet') {
      config[configKey] = val === 'true' || val === '1';
    } else {
      config[configKey] = val;
    }
  }

  return config;
}

function listEnvVars() {
  return Object.entries(envMap).map(([env, config]) => ({
    env,
    config,
    value: process.env[env] || null
  }));
}

module.exports = { loadEnvConfig, listEnvVars };
