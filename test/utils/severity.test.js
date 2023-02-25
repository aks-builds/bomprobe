const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { countBySeverity, totalFindings } = require('../../src/utils/severity');

describe('severity utils', () => {
  const checks = [
    { id: 'a', findings: [{ severity: 'error' }, { severity: 'warning' }] },
    { id: 'b', findings: [{ severity: 'info' }, { severity: 'warning' }] },
    { id: 'c', findings: [] }
  ];

  it('counts findings by severity', () => {
    const counts = countBySeverity(checks);
    assert.equal(counts.error, 1);
    assert.equal(counts.warning, 2);
    assert.equal(counts.info, 1);
  });

  it('returns total findings count', () => {
    assert.equal(totalFindings(checks), 4);
  });

  it('handles empty check results', () => {
    const counts = countBySeverity([]);
    assert.equal(counts.error, 0);
    assert.equal(totalFindings([]), 0);
  });
});
