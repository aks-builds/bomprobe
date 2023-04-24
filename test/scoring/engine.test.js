const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { calculateScore, assignGrade, computePenalty } = require('../../src/scoring/engine');

describe('scoring engine', () => {
  it('scores clean results at 100', () => {
    const results = [
      { id: 'a', weight: 1, findings: [] },
      { id: 'b', weight: 1, findings: [] }
    ];
    const score = calculateScore(results);
    assert.equal(score.overall, 100);
    assert.equal(score.grade, 'A');
  });

  it('penalizes errors heavily', () => {
    const results = [
      { id: 'a', weight: 1, findings: [{ severity: 'error', message: 'e' }] }
    ];
    const score = calculateScore(results);
    assert.equal(score.overall, 75);
  });

  it('penalizes warnings moderately', () => {
    const results = [
      { id: 'a', weight: 1, findings: [{ severity: 'warning', message: 'w' }] }
    ];
    assert.equal(calculateScore(results).overall, 90);
  });

  it('applies custom weights', () => {
    const results = [
      { id: 'important', weight: 1, findings: [] },
      { id: 'minor', weight: 1, findings: [{ severity: 'error', message: 'e' }] }
    ];
    const score = calculateScore(results, { weights: { important: 3, minor: 1 } });
    assert.ok(score.overall > 80);
  });

  it('assigns grades correctly', () => {
    assert.equal(assignGrade(95), 'A');
    assert.equal(assignGrade(85), 'B');
    assert.equal(assignGrade(75), 'C');
    assert.equal(assignGrade(65), 'D');
    assert.equal(assignGrade(50), 'F');
  });

  it('computes penalty from findings', () => {
    assert.equal(computePenalty([{ severity: 'error' }]), 25);
    assert.equal(computePenalty([{ severity: 'warning' }]), 10);
    assert.equal(computePenalty([{ severity: 'info' }]), 3);
    assert.equal(computePenalty([{ severity: 'error' }, { severity: 'warning' }]), 35);
  });

  it('counts total findings', () => {
    const results = [
      { id: 'a', weight: 1, findings: [{ severity: 'error' }, { severity: 'info' }] },
      { id: 'b', weight: 1, findings: [{ severity: 'warning' }] }
    ];
    assert.equal(calculateScore(results).findingCount, 3);
  });

  it('handles empty results', () => {
    const score = calculateScore([]);
    assert.equal(score.overall, 100);
    assert.equal(score.grade, 'A');
  });
});
