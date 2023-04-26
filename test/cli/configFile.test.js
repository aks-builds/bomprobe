const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { findConfigFile, mergeConfigs, CONFIG_FILENAMES } = require('../../src/cli/configFile');

describe('configFile', () => {
  it('lists supported config filenames', () => {
    assert.ok(CONFIG_FILENAMES.includes('.bomproberc'));
    assert.ok(CONFIG_FILENAMES.includes('.bomproberc.json'));
    assert.ok(CONFIG_FILENAMES.includes('bomprobe.config.json'));
  });

  it('returns null when no config exists', () => {
    const result = findConfigFile('/nonexistent/path/xyz');
    assert.equal(result, null);
  });

  it('merges CLI over file config', () => {
    const file = { format: 'json', threshold: 50 };
    const cli = { format: 'text' };
    const merged = mergeConfigs(file, cli);
    assert.equal(merged.format, 'text');
    assert.equal(merged.threshold, 50);
  });

  it('ignores null CLI values', () => {
    const file = { format: 'json' };
    const cli = { format: null };
    const merged = mergeConfigs(file, cli);
    assert.equal(merged.format, 'json');
  });

  it('ignores undefined CLI values', () => {
    const file = { threshold: 80 };
    const cli = { threshold: undefined, format: 'csv' };
    const merged = mergeConfigs(file, cli);
    assert.equal(merged.threshold, 80);
    assert.equal(merged.format, 'csv');
  });
});
