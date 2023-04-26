const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatProfileReport, formatProfileJson } = require('../../src/scoring/profileReport');

describe('profile report formatting', () => {
  const results = [
    { id: 'component-hashes', weight: 0.5, findings: [] },
    { id: 'component-supplier', weight: 0.4, findings: [{ severity: 'error', message: 'missing' }] }
  ];

  it('formats text report with score', () => {
    const text = formatProfileReport('supply_chain', results);
    assert.ok(text.includes('supply_chain'));
    assert.ok(text.includes('PASS'));
    assert.ok(text.includes('FAIL'));
  });

  it('shows percentage score', () => {
    const text = formatProfileReport('supply_chain', results);
    assert.ok(text.includes('Score:'));
  });

  it('shows rating', () => {
    const text = formatProfileReport('supply_chain', results);
    assert.ok(text.includes('Rating:'));
  });

  it('formats JSON report', () => {
    const json = formatProfileJson('supply_chain', results);
    assert.equal(json.profile, 'supply_chain');
    assert.ok(typeof json.score === 'number');
    assert.equal(json.checks.length, 2);
  });

  it('JSON check includes passed status', () => {
    const json = formatProfileJson('supply_chain', results);
    assert.equal(json.checks[0].passed, true);
    assert.equal(json.checks[1].passed, false);
  });

  it('handles all passing checks', () => {
    const passing = [{ id: 'a', weight: 0.5, findings: [] }];
    const json = formatProfileJson('test', passing);
    assert.equal(json.score, 100);
  });
});
