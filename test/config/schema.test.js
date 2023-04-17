const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { validateConfig } = require('../../src/config/schema');

describe('config schema validation', () => {
  it('passes valid config', () => {
    const result = validateConfig({ format: 'json', threshold: 80, failOn: 'C' });
    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);
  });

  it('passes empty config', () => {
    assert.equal(validateConfig({}).valid, true);
  });

  it('rejects invalid format', () => {
    const result = validateConfig({ format: 'yaml' });
    assert.equal(result.valid, false);
    assert.ok(result.errors[0].includes('Invalid format'));
  });

  it('rejects invalid failOn grade', () => {
    const result = validateConfig({ failOn: 'Z' });
    assert.equal(result.valid, false);
  });

  it('rejects threshold out of range', () => {
    assert.equal(validateConfig({ threshold: -1 }).valid, false);
    assert.equal(validateConfig({ threshold: 101 }).valid, false);
    assert.equal(validateConfig({ threshold: 'high' }).valid, false);
  });

  it('rejects non-array exclude', () => {
    assert.equal(validateConfig({ exclude: 'check-1' }).valid, false);
  });

  it('rejects non-array only', () => {
    assert.equal(validateConfig({ only: 'check-1' }).valid, false);
  });

  it('validates weight values', () => {
    assert.equal(validateConfig({ weights: { metadata: 0.5 } }).valid, true);
    assert.equal(validateConfig({ weights: { metadata: 2 } }).valid, false);
    assert.equal(validateConfig({ weights: { metadata: -1 } }).valid, false);
  });

  it('rejects non-object weights', () => {
    assert.equal(validateConfig({ weights: [1, 2] }).valid, false);
  });

  it('validates compliance as string', () => {
    assert.equal(validateConfig({ compliance: 'ntia' }).valid, true);
    assert.equal(validateConfig({ compliance: 123 }).valid, false);
  });

  it('collects multiple errors', () => {
    const result = validateConfig({ format: 'yaml', threshold: -5, failOn: 'Z' });
    assert.equal(result.errors.length, 3);
  });
});
