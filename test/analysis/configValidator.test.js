const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { validateConfig, mergeConfigs, formatValidation } = require('../../src/analysis/configValidator');

describe('validateConfig', () => {
  it('passes valid config', () => {
    const result = validateConfig({ format: 'json', profile: 'ntia', threshold: 70 });
    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);
  });

  it('rejects unknown format', () => {
    const result = validateConfig({ format: 'yaml' });
    assert.equal(result.valid, false);
    assert.ok(result.errors[0].includes('format'));
  });

  it('rejects unknown profile', () => {
    const result = validateConfig({ profile: 'nist' });
    assert.equal(result.valid, false);
  });

  it('rejects threshold out of range', () => {
    assert.equal(validateConfig({ threshold: 150 }).valid, false);
    assert.equal(validateConfig({ threshold: -1 }).valid, false);
    assert.equal(validateConfig({ threshold: 'abc' }).valid, false);
  });

  it('warns on both exclude and only', () => {
    const result = validateConfig({ exclude: ['a'], only: ['b'] });
    assert.ok(result.warnings.length > 0);
  });

  it('rejects non-array exclude', () => {
    assert.equal(validateConfig({ exclude: 'check-1' }).valid, false);
  });

  it('rejects invalid failOn', () => {
    assert.equal(validateConfig({ failOn: 'critical' }).valid, false);
    assert.equal(validateConfig({ failOn: 'error' }).valid, true);
  });
});

describe('mergeConfigs', () => {
  it('merges multiple configs', () => {
    const result = mergeConfigs({ format: 'text' }, { profile: 'ntia' }, { format: 'json' });
    assert.equal(result.format, 'json');
    assert.equal(result.profile, 'ntia');
  });

  it('ignores null values', () => {
    const result = mergeConfigs({ format: 'text' }, { format: null });
    assert.equal(result.format, 'text');
  });

  it('handles undefined inputs', () => {
    const result = mergeConfigs(undefined, null, { format: 'json' });
    assert.equal(result.format, 'json');
  });
});

describe('formatValidation', () => {
  it('shows valid message', () => {
    const out = formatValidation({ valid: true, errors: [], warnings: [] });
    assert.ok(out.includes('valid'));
  });

  it('shows errors', () => {
    const out = formatValidation({ valid: false, errors: ['bad format'], warnings: [] });
    assert.ok(out.includes('ERROR'));
    assert.ok(out.includes('bad format'));
  });
});
