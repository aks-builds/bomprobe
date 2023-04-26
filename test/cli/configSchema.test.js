const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { validateConfigSchema } = require('../../src/cli/configSchema');

describe('configSchema validation', () => {
  it('passes valid config', () => {
    const r = validateConfigSchema({ format: 'json', threshold: 80, failOn: 'error' });
    assert.ok(r.valid);
    assert.equal(r.errors.length, 0);
  });

  it('rejects invalid format', () => {
    const r = validateConfigSchema({ format: 'xml' });
    assert.ok(!r.valid);
    assert.ok(r.errors[0].includes('format'));
  });

  it('rejects invalid failOn', () => {
    const r = validateConfigSchema({ failOn: 'critical' });
    assert.ok(!r.valid);
  });

  it('rejects threshold out of range', () => {
    assert.ok(!validateConfigSchema({ threshold: 150 }).valid);
    assert.ok(!validateConfigSchema({ threshold: -1 }).valid);
  });

  it('rejects exclude and only together', () => {
    const r = validateConfigSchema({ exclude: ['a'], only: ['b'] });
    assert.ok(!r.valid);
    assert.ok(r.errors.some(e => e.includes('both')));
  });

  it('rejects non-array exclude', () => {
    const r = validateConfigSchema({ exclude: 'component-name' });
    assert.ok(!r.valid);
  });

  it('passes empty config', () => {
    assert.ok(validateConfigSchema({}).valid);
  });
});
