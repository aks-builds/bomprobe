const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { getFormatter, listFormatters } = require('../../src/formatters');

describe('formatter registry', () => {
  it('lists all formatters', () => {
    const names = listFormatters();
    assert.ok(names.includes('text'));
    assert.ok(names.includes('json'));
    assert.ok(names.includes('markdown'));
    assert.ok(names.includes('csv'));
  });

  it('returns formatter by name', () => {
    const f = getFormatter('json');
    assert.ok(f);
    assert.equal(typeof f.formatResult, 'function');
  });

  it('returns null for unknown formatter', () => {
    assert.equal(getFormatter('xml'), null);
  });
});
