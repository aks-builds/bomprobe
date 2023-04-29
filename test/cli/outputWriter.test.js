const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatDuration, formatCount } = require('../../src/cli/outputWriter');

describe('outputWriter', () => {
  it('formats milliseconds', () => {
    assert.equal(formatDuration(42), '42ms');
  });

  it('formats seconds', () => {
    assert.equal(formatDuration(1500), '1.5s');
  });

  it('formats singular count', () => {
    assert.equal(formatCount(1, 'finding'), '1 finding');
  });

  it('formats plural count', () => {
    assert.equal(formatCount(5, 'finding'), '5 findings');
  });

  it('uses custom plural', () => {
    assert.equal(formatCount(3, 'match', 'matches'), '3 matches');
  });
});
