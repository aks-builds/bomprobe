const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatSarifEnhanced } = require('../../src/output/sarifEnhanced');

describe('enhanced SARIF output', () => {
  const result = {
    checks: [
      { id: 'component-name', name: 'Component Name', weight: 0.3, findings: [] },
      { id: 'component-version', name: 'Component Version', weight: 0.3, findings: [
        { severity: 'error', component: 'lodash', message: 'missing version' }
      ]}
    ]
  };

  it('produces valid SARIF structure', () => {
    const sarif = formatSarifEnhanced(result);
    assert.equal(sarif.version, '2.1.0');
    assert.ok(sarif.$schema.includes('sarif'));
    assert.equal(sarif.runs.length, 1);
  });

  it('maps rules from checks', () => {
    const sarif = formatSarifEnhanced(result);
    assert.equal(sarif.runs[0].tool.driver.rules.length, 2);
  });

  it('maps findings to results', () => {
    const sarif = formatSarifEnhanced(result);
    assert.equal(sarif.runs[0].results.length, 1);
    assert.equal(sarif.runs[0].results[0].ruleId, 'component-version');
  });

  it('maps severity to SARIF level', () => {
    const sarif = formatSarifEnhanced(result);
    assert.equal(sarif.runs[0].results[0].level, 'error');
  });

  it('includes weight in rule properties', () => {
    const sarif = formatSarifEnhanced(result);
    assert.equal(sarif.runs[0].tool.driver.rules[0].properties.weight, 0.3);
  });
});
