const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { validateConfig } = require('../src/configSchema');

describe('config schema validator', () => {
  it('passes valid config', () => {
    const result = validateConfig({ exclude: ['component-name'], minScore: 7 });
    assert.ok(result.valid);
    assert.equal(result.errors.length, 0);
  });

  it('rejects unknown keys', () => {
    const result = validateConfig({ bogus: true });
    assert.ok(!result.valid);
    assert.ok(result.errors[0].includes('Unknown'));
  });

  it('validates exclude is array', () => {
    const result = validateConfig({ exclude: 'not-array' });
    assert.ok(!result.valid);
  });

  it('validates minScore range', () => {
    assert.ok(!validateConfig({ minScore: 15 }).valid);
    assert.ok(!validateConfig({ minScore: -1 }).valid);
    assert.ok(validateConfig({ minScore: 5 }).valid);
  });

  it('validates failOn values', () => {
    assert.ok(validateConfig({ failOn: 'error' }).valid);
    assert.ok(!validateConfig({ failOn: 'critical' }).valid);
  });

  it('validates format values', () => {
    assert.ok(validateConfig({ format: 'json' }).valid);
    assert.ok(!validateConfig({ format: 'yaml' }).valid);
  });

  it('rejects non-object config', () => {
    assert.ok(!validateConfig(null).valid);
    assert.ok(!validateConfig('string').valid);
  });
});
