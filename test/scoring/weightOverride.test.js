const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { applyWeightOverrides, parseWeightString } = require('../../src/scoring/weightOverride');

describe('weight overrides', () => {
  it('overrides weight for matching check', () => {
    const checks = [{ id: 'comp-name', weight: 0.3 }];
    const result = applyWeightOverrides(checks, { 'comp-name': 0.5 });
    assert.equal(result[0].weight, 0.5);
  });

  it('disables check with weight 0', () => {
    const checks = [{ id: 'comp-name', weight: 0.3 }];
    const result = applyWeightOverrides(checks, { 'comp-name': 0 });
    assert.equal(result[0].weight, 0);
    assert.equal(result[0].disabled, true);
  });

  it('leaves unmatched checks unchanged', () => {
    const checks = [{ id: 'comp-name', weight: 0.3 }];
    const result = applyWeightOverrides(checks, { other: 0.5 });
    assert.equal(result[0].weight, 0.3);
  });

  it('parses comma-separated weight string', () => {
    const o = parseWeightString('comp-name=0.5, comp-ver=0.3');
    assert.equal(o['comp-name'], 0.5);
    assert.equal(o['comp-ver'], 0.3);
  });

  it('handles null overrides', () => {
    const checks = [{ id: 'a', weight: 0.1 }];
    const result = applyWeightOverrides(checks, null);
    assert.equal(result[0].weight, 0.1);
  });
});
