const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatTrendReport, formatTrendJson } = require('../../src/output/trendReport');

describe('trend report', () => {
  const snapshots = [
    { timestamp: '2023-04-01', score: 65, componentCount: 10, findingCount: 5 },
    { timestamp: '2023-04-15', score: 72, componentCount: 12, findingCount: 3 },
    { timestamp: '2023-04-29', score: 80, componentCount: 12, findingCount: 1 }
  ];

  it('formats markdown trend report', () => {
    const report = formatTrendReport(snapshots);
    assert.ok(report.includes('improved'));
    assert.ok(report.includes('65 -> 80'));
    assert.ok(report.includes('Total snapshots: 3'));
  });

  it('handles empty snapshots', () => {
    assert.ok(formatTrendReport([]).includes('No snapshots'));
  });

  it('formats json trend', () => {
    const json = formatTrendJson(snapshots);
    assert.equal(json.trend, 'improved');
    assert.equal(json.count, 3);
    assert.equal(json.latest.score, 80);
  });

  it('detects declined trend', () => {
    const declining = [
      { score: 80 },
      { score: 60 }
    ];
    assert.equal(formatTrendJson(declining).trend, 'declined');
  });

  it('handles no data', () => {
    assert.equal(formatTrendJson([]).trend, 'no_data');
  });
});
