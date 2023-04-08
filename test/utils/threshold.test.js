const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { checkThreshold, evaluateThresholds } = require('../../src/utils/threshold');

describe('threshold utilities', () => {
  it('checks min threshold', () => {
    assert.ok(checkThreshold(7, 5));
    assert.ok(!checkThreshold(3, 5));
  });

  it('checks max threshold', () => {
    assert.ok(checkThreshold(3, 5, 'max'));
    assert.ok(!checkThreshold(7, 5, 'max'));
  });

  it('evaluates score threshold', () => {
    const result = { score: { overall: 7, components: { average: 6 }, metadata: 5 } };
    assert.ok(evaluateThresholds(result, { score: 5 }).passed);
    assert.ok(!evaluateThresholds(result, { score: 8 }).passed);
  });

  it('evaluates component score threshold', () => {
    const result = { score: { overall: 7, components: { average: 6 }, metadata: 5 } };
    assert.ok(!evaluateThresholds(result, { componentScore: 7 }).passed);
  });

  it('evaluates metadata score threshold', () => {
    const result = { score: { overall: 7, components: { average: 6 }, metadata: 5 } };
    assert.ok(!evaluateThresholds(result, { metadataScore: 6 }).passed);
  });

  it('passes with no thresholds', () => {
    const result = { score: { overall: 1, components: { average: 1 }, metadata: 1 } };
    assert.ok(evaluateThresholds(result, {}).passed);
  });
});
