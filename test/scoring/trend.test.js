const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { compareScorecards, formatTrendText } = require('../../src/scoring/trend');

describe('scoring trend', () => {
  const before = { overall: 70, grade: 'C', categories: { metadata: 80, components: 60 } };
  const after = { overall: 85, grade: 'B', categories: { metadata: 90, components: 60, dependencies: 75 } };

  it('calculates score delta', () => {
    const result = compareScorecards(before, after);
    assert.equal(result.scoreDelta, 15);
  });

  it('detects improved categories', () => {
    const result = compareScorecards(before, after);
    assert.equal(result.improved.length, 2);
  });

  it('detects unchanged categories', () => {
    const result = compareScorecards(before, after);
    assert.equal(result.unchanged.length, 1);
    assert.equal(result.unchanged[0].category, 'components');
  });

  it('detects regression', () => {
    const worse = { overall: 60, grade: 'D', categories: { metadata: 50 } };
    const result = compareScorecards(before, worse);
    assert.ok(result.regressed.length > 0);
  });

  it('formats text output', () => {
    const result = compareScorecards(before, after);
    const text = formatTrendText(result);
    assert.ok(text.includes('C -> B'));
    assert.ok(text.includes('+15'));
  });

  it('handles empty categories', () => {
    const result = compareScorecards({ overall: 50 }, { overall: 60 });
    assert.equal(result.scoreDelta, 10);
  });
});
