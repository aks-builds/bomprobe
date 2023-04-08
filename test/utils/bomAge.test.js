const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { calculateAge, isStale, formatAge } = require('../../src/utils/bomAge');

describe('BOM age utilities', () => {
  it('calculates age from timestamp', () => {
    const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
    const age = calculateAge(oneYearAgo);
    assert.ok(age.days >= 364);
  });

  it('returns null for missing timestamp', () => {
    assert.equal(calculateAge(null), null);
    assert.equal(calculateAge(''), null);
  });

  it('returns null for invalid timestamp', () => {
    assert.equal(calculateAge('not-a-date'), null);
  });

  it('detects stale BOM', () => {
    const old = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString();
    assert.ok(isStale(old, 90));
  });

  it('detects fresh BOM', () => {
    const recent = new Date().toISOString();
    assert.ok(!isStale(recent, 90));
  });

  it('formats age in years', () => {
    const twoYearsAgo = new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString();
    assert.ok(formatAge(twoYearsAgo).includes('year'));
  });

  it('formats unknown for null', () => {
    assert.equal(formatAge(null), 'unknown');
  });
});
