const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatCompliance, complianceToJson } = require('../../src/compliance/reporter');

describe('compliance reporter', () => {
  it('formats compliant result', () => {
    const evaluation = {
      profile: 'NTIA Minimum Elements',
      compliant: true,
      passed: ['component-name'],
      failed: [],
      score: 100
    };
    const output = formatCompliance(evaluation);
    assert.ok(output.includes('COMPLIANT'));
    assert.ok(output.includes('100%'));
  });

  it('formats non-compliant result', () => {
    const evaluation = {
      profile: 'NTIA',
      compliant: false,
      passed: ['component-name'],
      failed: [{ id: 'component-version', reason: 'has errors' }],
      score: 50
    };
    const output = formatCompliance(evaluation);
    assert.ok(output.includes('NON-COMPLIANT'));
    assert.ok(output.includes('[FAIL]'));
  });

  it('formats error', () => {
    assert.ok(formatCompliance({ error: 'bad profile' }).includes('Error'));
  });

  it('produces valid JSON', () => {
    const evaluation = { profile: 'NTIA', compliant: true, passed: [], failed: [], score: 100 };
    const json = complianceToJson(evaluation);
    const parsed = JSON.parse(json);
    assert.equal(parsed.compliant, true);
  });
});
