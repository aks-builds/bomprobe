const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { getPreset, listPresets, applyPreset } = require('../../src/cli/configPresets');

describe('config presets', () => {
  it('returns strict preset', () => {
    const p = getPreset('strict');
    assert.equal(p.threshold, 90);
    assert.equal(p.failOn, 'warning');
  });

  it('returns null for unknown preset', () => {
    assert.equal(getPreset('nonexistent'), null);
  });

  it('lists all presets', () => {
    const list = listPresets();
    assert.ok(list.length >= 5);
    assert.ok(list.some(p => p.name === 'ci'));
  });

  it('applies preset with overrides', () => {
    const result = applyPreset('strict', { threshold: 95 });
    assert.equal(result.threshold, 95);
    assert.equal(result.failOn, 'warning');
  });

  it('returns overrides alone for unknown preset', () => {
    const result = applyPreset('nope', { threshold: 50 });
    assert.equal(result.threshold, 50);
  });
});
