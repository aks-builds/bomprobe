const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { addEntry, computeTrend, formatTrend } = require('../../src/tracking/trendTracker');

describe('addEntry', () => {
  it('appends entry with timestamp', () => {
    const history = [];
    addEntry(history, { score: 7.5, grade: 'B', findings: 10, checks: 140, components: 50 });
    assert.equal(history.length, 1);
    assert.ok(history[0].timestamp);
    assert.equal(history[0].score, 7.5);
  });

  it('preserves existing entries', () => {
    const history = [{ timestamp: '2023-01-01', score: 6.0 }];
    addEntry(history, { score: 7.5 });
    assert.equal(history.length, 2);
  });
});

describe('computeTrend', () => {
  it('returns stable for single entry', () => {
    const trend = computeTrend([{ score: 7.0 }]);
    assert.equal(trend.direction, 'stable');
    assert.equal(trend.entries, 1);
  });

  it('detects improving trend', () => {
    const history = [
      { score: 5.0 }, { score: 6.0 }, { score: 7.0 }, { score: 8.0 }
    ];
    const trend = computeTrend(history);
    assert.equal(trend.direction, 'improving');
    assert.ok(trend.delta > 0);
  });

  it('detects declining trend', () => {
    const history = [
      { score: 9.0 }, { score: 8.0 }, { score: 7.0 }, { score: 5.0 }
    ];
    const trend = computeTrend(history);
    assert.equal(trend.direction, 'declining');
    assert.ok(trend.delta < 0);
  });

  it('detects stable trend', () => {
    const history = [
      { score: 7.0 }, { score: 7.1 }, { score: 7.0 }, { score: 7.2 }
    ];
    const trend = computeTrend(history);
    assert.equal(trend.direction, 'stable');
  });

  it('calculates stats for recent entries', () => {
    const history = [
      { score: 5.0 }, { score: 6.0 }, { score: 7.0 }, { score: 8.0 }, { score: 9.0 }
    ];
    const trend = computeTrend(history);
    assert.equal(trend.recent.min, 5.0);
    assert.equal(trend.recent.max, 9.0);
    assert.equal(trend.recent.count, 5);
  });
});

describe('formatTrend', () => {
  it('formats readable output', () => {
    const trend = computeTrend([{ score: 5.0 }, { score: 8.0 }]);
    const out = formatTrend(trend);
    assert.ok(out.includes('improving'));
    assert.ok(out.includes('Quality Trend'));
  });
});
