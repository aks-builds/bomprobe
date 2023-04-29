const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { loadEnvConfig, listEnvVars } = require('../../src/cli/envConfig');

describe('env config', () => {
  const saved = {};

  beforeEach(() => {
    for (const key of ['BOMPROBE_FORMAT', 'BOMPROBE_THRESHOLD', 'BOMPROBE_QUIET']) {
      saved[key] = process.env[key];
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const [key, val] of Object.entries(saved)) {
      if (val === undefined) delete process.env[key];
      else process.env[key] = val;
    }
  });

  it('loads format from env', () => {
    process.env.BOMPROBE_FORMAT = 'json';
    assert.equal(loadEnvConfig().format, 'json');
  });

  it('converts threshold to number', () => {
    process.env.BOMPROBE_THRESHOLD = '85';
    assert.equal(loadEnvConfig().threshold, 85);
  });

  it('converts quiet to boolean', () => {
    process.env.BOMPROBE_QUIET = 'true';
    assert.equal(loadEnvConfig().quiet, true);
  });

  it('returns empty for no env vars', () => {
    assert.deepEqual(loadEnvConfig(), {});
  });

  it('lists all env vars', () => {
    const vars = listEnvVars();
    assert.ok(vars.length >= 6);
    assert.ok(vars.some(v => v.env === 'BOMPROBE_FORMAT'));
  });
});
