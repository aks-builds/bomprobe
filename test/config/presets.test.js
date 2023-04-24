const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { getPreset, listPresets, mergePreset } = require('../../src/config/presets');

describe('config presets', () => {
  it('returns strict preset', () => {
    const p = getPreset('strict');
    assert.equal(p.failOn, 'warning');
    assert.equal(p.threshold, 80);
    assert.equal(p.compliance.length, 3);
  });

  it('returns ci preset with SARIF format', () => {
    const p = getPreset('ci');
    assert.equal(p.format, 'sarif');
    assert.equal(p.failOn, 'error');
  });

  it('returns null for unknown preset', () => {
    assert.equal(getPreset('nonexistent'), null);
  });

  it('lists all presets', () => {
    const list = listPresets();
    assert.equal(list.length, 5);
    assert.ok(list.some(p => p.id === 'strict'));
    assert.ok(list.some(p => p.id === 'audit'));
  });

  it('merges preset with overrides', () => {
    const config = mergePreset('moderate', { threshold: 75 });
    assert.equal(config.threshold, 75);
    assert.equal(config.failOn, 'error');
  });

  it('returns overrides when preset not found', () => {
    const config = mergePreset('bogus', { failOn: 'any' });
    assert.equal(config.failOn, 'any');
  });

  it('audit preset checks all compliance profiles', () => {
    const p = getPreset('audit');
    assert.equal(p.failOn, 'any');
    assert.equal(p.threshold, 90);
    assert.deepEqual(p.compliance, ['ntia', 'eucra', 'bsitr']);
  });
});
