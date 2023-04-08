const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { createReport, formatDuration } = require('../../src/utils/reporter');

describe('reporter utility', () => {
  it('formats milliseconds', () => {
    assert.equal(formatDuration(500), '500ms');
  });

  it('formats seconds', () => {
    assert.equal(formatDuration(2500), '2.50s');
  });

  it('creates report with summary', () => {
    const result = {
      file: 'test.json',
      format: 'cyclonedx',
      componentCount: 10,
      score: { overall: 7 },
      checks: [
        { id: 'a', name: 'A', findings: [] },
        { id: 'b', name: 'B', findings: [{ severity: 'error', message: 'x' }] }
      ]
    };
    const report = createReport(result);
    assert.equal(report.summary.checksRun, 2);
    assert.equal(report.summary.passed, 1);
    assert.equal(report.summary.failed, 1);
    assert.ok(report.generatedAt);
  });

  it('includes compliance when present', () => {
    const result = {
      file: 'x', format: 'cdx', componentCount: 1,
      score: { overall: 5 },
      checks: [],
      compliance: { compliant: true }
    };
    assert.ok(createReport(result).compliance.compliant);
  });

  it('handles no compliance', () => {
    const result = {
      file: 'x', format: 'cdx', componentCount: 1,
      score: { overall: 5 },
      checks: []
    };
    assert.equal(createReport(result).compliance, null);
  });
});
