const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { validateConfig } = require('../../src/config/validate');

describe('config validation', () => {
  it('passes valid config', () => {
    const result = validateConfig({ format: 'json', failOn: 'error', threshold: 70 });
    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);
  });

  it('rejects unknown format', () => {
    const result = validateConfig({ format: 'xml' });
    assert.equal(result.valid, false);
    assert.ok(result.errors[0].includes('format'));
  });

  it('rejects unknown failOn', () => {
    const result = validateConfig({ failOn: 'always' });
    assert.equal(result.valid, false);
  });

  it('rejects threshold out of range', () => {
    assert.equal(validateConfig({ threshold: 150 }).valid, false);
    assert.equal(validateConfig({ threshold: -5 }).valid, false);
  });

  it('rejects unknown compliance profile', () => {
    const result = validateConfig({ complianceProfiles: ['ntia', 'unknown'] });
    assert.equal(result.valid, false);
  });

  it('rejects non-array exclude', () => {
    assert.equal(validateConfig({ exclude: 'check-a' }).valid, false);
  });

  it('rejects exclude + only together', () => {
    assert.equal(validateConfig({ exclude: ['a'], only: ['b'] }).valid, false);
  });

  it('passes empty config', () => {
    assert.equal(validateConfig({}).valid, true);
  });
});
