const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { categorizeFindings, categoryScore, scoreBreakdown } = require('../../src/scoring/breakdown');

describe('score breakdown', () => {
  it('categorizes metadata checks', () => {
    const results = [
      { id: 'metadata-timestamp', weight: 0.3, findings: [] },
      { id: 'component-name', weight: 0.5, findings: [] }
    ];
    const cats = categorizeFindings(results);
    assert.equal(cats.metadata.length, 1);
    assert.equal(cats.components.length, 1);
  });

  it('scores 100 for no findings', () => {
    assert.equal(categoryScore([{ weight: 0.5, findings: [] }]), 100);
  });

  it('penalizes errors heavily', () => {
    const result = categoryScore([{
      weight: 1,
      findings: [{ severity: 'error' }]
    }]);
    assert.ok(result < 100);
    assert.equal(result, 70);
  });

  it('penalizes warnings lightly', () => {
    const result = categoryScore([{
      weight: 1,
      findings: [{ severity: 'warning' }]
    }]);
    assert.equal(result, 90);
  });

  it('produces full breakdown', () => {
    const results = [
      { id: 'metadata-timestamp', weight: 0.3, findings: [] },
      { id: 'component-name', weight: 0.5, findings: [{ severity: 'error' }] },
      { id: 'dependency-coverage', weight: 0.6, findings: [] },
      { id: 'license-expression', weight: 0.4, findings: [] }
    ];
    const breakdown = scoreBreakdown(results);
    assert.equal(breakdown.metadata, 100);
    assert.equal(breakdown.dependencies, 100);
    assert.equal(breakdown.compliance, 100);
    assert.ok(breakdown.components < 100);
  });
});
