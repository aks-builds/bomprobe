const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { compareToBaseline, addSuppression, applySuppression, formatComparison } = require('../../src/baseline/baselineManager');

describe('compareToBaseline', () => {
  it('returns no-baseline when baseline is null', () => {
    const result = compareToBaseline(null, { findings: [] });
    assert.equal(result.status, 'no-baseline');
  });

  it('detects stable state', () => {
    const baseline = { score: 80, findings: [{ checkId: 'a', severity: 'warning', message: 'test', component: null }] };
    const current = { score: 80, findings: [{ checkId: 'a', severity: 'warning', message: 'test' }] };
    const result = compareToBaseline(baseline, current);
    assert.equal(result.status, 'stable');
    assert.equal(result.newFindings.length, 0);
    assert.equal(result.resolvedFindings.length, 0);
  });

  it('detects new findings', () => {
    const baseline = { score: 80, findings: [] };
    const current = { score: 75, findings: [{ checkId: 'x', severity: 'warning', message: 'new one' }] };
    const result = compareToBaseline(baseline, current);
    assert.equal(result.status, 'changed');
    assert.equal(result.newFindings.length, 1);
  });

  it('detects resolved findings', () => {
    const baseline = { score: 70, findings: [{ checkId: 'old', severity: 'error', message: 'gone', component: null }] };
    const current = { score: 85, findings: [] };
    const result = compareToBaseline(baseline, current);
    assert.equal(result.resolvedFindings.length, 1);
  });

  it('detects regression on score drop', () => {
    const baseline = { score: 80, findings: [] };
    const current = { score: 70, findings: [{ checkId: 'x', severity: 'error', message: 'bad' }] };
    const result = compareToBaseline(baseline, current);
    assert.equal(result.status, 'regressed');
    assert.ok(result.regressions.some(r => r.type === 'score-drop'));
  });

  it('detects regression on new errors', () => {
    const baseline = { score: 80, findings: [] };
    const current = { score: 79, findings: [{ checkId: 'x', severity: 'error', message: 'bad' }] };
    const result = compareToBaseline(baseline, current);
    assert.ok(result.regressions.some(r => r.type === 'new-errors'));
  });
});

describe('addSuppression', () => {
  it('adds suppression to baseline', () => {
    const baseline = { suppressions: [] };
    addSuppression(baseline, { checkId: 'a', message: 'test' }, 'accepted risk');
    assert.equal(baseline.suppressions.length, 1);
    assert.equal(baseline.suppressions[0].reason, 'accepted risk');
  });

  it('creates suppressions array if missing', () => {
    const baseline = {};
    addSuppression(baseline, { checkId: 'a', message: 'test' }, 'ok');
    assert.equal(baseline.suppressions.length, 1);
  });
});

describe('applySuppression', () => {
  it('filters suppressed findings', () => {
    const findings = [
      { checkId: 'a', message: 'test', component: null, severity: 'warning' },
      { checkId: 'b', message: 'keep', component: null, severity: 'error' }
    ];
    const baseline = { suppressions: [{ checkId: 'a', component: null, message: 'test' }] };
    const filtered = applySuppression(findings, baseline);
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0].checkId, 'b');
  });

  it('returns all when no baseline', () => {
    const findings = [{ checkId: 'a', message: 'test' }];
    assert.equal(applySuppression(findings, null).length, 1);
  });
});

describe('formatComparison', () => {
  it('formats readable output', () => {
    const comp = compareToBaseline(
      { score: 80, findings: [{ checkId: 'old', severity: 'info', message: 'gone', component: null }] },
      { score: 85, findings: [{ checkId: 'new', severity: 'warning', message: 'appeared' }] }
    );
    const out = formatComparison(comp);
    assert.ok(out.includes('Baseline Comparison'));
    assert.ok(out.includes('New findings'));
    assert.ok(out.includes('Resolved findings'));
  });
});
