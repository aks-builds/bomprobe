const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { diffSarifResults } = require('../../src/output/sarifDiff');

describe('SARIF diff', () => {
  const before = {
    runs: [{ results: [
      { ruleId: 'component-name', message: { text: 'lodash missing name' } },
      { ruleId: 'component-version', message: { text: 'express missing version' } }
    ]}]
  };

  const after = {
    runs: [{ results: [
      { ruleId: 'component-name', message: { text: 'lodash missing name' } },
      { ruleId: 'component-purl', message: { text: 'axios missing purl' } }
    ]}]
  };

  it('detects new findings', () => {
    const diff = diffSarifResults(before, after);
    assert.equal(diff.newFindings.length, 1);
    assert.equal(diff.newFindings[0].ruleId, 'component-purl');
  });

  it('detects fixed findings', () => {
    const diff = diffSarifResults(before, after);
    assert.equal(diff.fixedFindings.length, 1);
    assert.equal(diff.fixedFindings[0].ruleId, 'component-version');
  });

  it('calculates delta', () => {
    const diff = diffSarifResults(before, after);
    assert.equal(diff.delta, 0);
    assert.equal(diff.beforeCount, 2);
    assert.equal(diff.afterCount, 2);
  });

  it('handles empty before', () => {
    const diff = diffSarifResults({ runs: [{ results: [] }] }, after);
    assert.equal(diff.newFindings.length, 2);
    assert.equal(diff.fixedFindings.length, 0);
  });

  it('handles empty after', () => {
    const diff = diffSarifResults(before, { runs: [{ results: [] }] });
    assert.equal(diff.newFindings.length, 0);
    assert.equal(diff.fixedFindings.length, 2);
  });
});
