const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { DEFAULT_WEIGHTS, normalizeWeights, applyWeights } = require('../../src/scoring/weights');

describe('scoring weights', () => {
  it('has default weights summing to 1', () => {
    const sum = Object.values(DEFAULT_WEIGHTS).reduce((s, v) => s + v, 0);
    assert.equal(sum, 1);
  });

  it('normalizes custom weights', () => {
    const custom = { metadata: 50, components: 50, dependencies: 0, compliance: 0 };
    const result = normalizeWeights(custom);
    assert.equal(result.metadata, 0.5);
    assert.equal(result.components, 0.5);
  });

  it('falls back to defaults for zero total', () => {
    const result = normalizeWeights({ metadata: 0, components: 0, dependencies: 0, compliance: 0 });
    assert.deepEqual(result, DEFAULT_WEIGHTS);
  });

  it('applies weights to category scores', () => {
    const scores = { metadata: 80, components: 60, dependencies: 70, compliance: 90 };
    const result = applyWeights(scores, DEFAULT_WEIGHTS);
    const expected = 80 * 0.25 + 60 * 0.35 + 70 * 0.20 + 90 * 0.20;
    assert.equal(result, Math.round(expected * 100) / 100);
  });
});
