const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { findConfigFile, loadConfig, resolveConfig, CONFIG_FILENAMES } = require('../../src/config/loader');
const { join } = require('node:path');

describe('config loader', () => {
  it('exports known config filenames', () => {
    assert.ok(CONFIG_FILENAMES.includes('.bomprobe.json'));
    assert.ok(CONFIG_FILENAMES.includes('.bomproberc'));
  });

  it('returns null when no config file exists', () => {
    const result = findConfigFile('/nonexistent/path/unlikely');
    assert.equal(result, null);
  });

  it('returns empty config when dir has no config', () => {
    const result = loadConfig('/nonexistent/path/unlikely');
    assert.deepEqual(result.config, {});
    assert.equal(result.path, null);
  });

  it('resolveConfig merges defaults with cli flags', () => {
    const resolved = resolveConfig({}, { format: 'json' });
    assert.equal(resolved.format, 'json');
    assert.equal(resolved.threshold, 0);
  });

  it('resolveConfig lets file config override defaults', () => {
    const resolved = resolveConfig({ threshold: 80 }, {});
    assert.equal(resolved.threshold, 80);
  });

  it('resolveConfig lets cli flags override file config', () => {
    const resolved = resolveConfig({ format: 'text' }, { format: 'csv' });
    assert.equal(resolved.format, 'csv');
  });
});
