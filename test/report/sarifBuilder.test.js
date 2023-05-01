const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { buildSarif, mapSeverityToLevel } = require('../../src/report/sarifBuilder');

describe('buildSarif', () => {
  it('produces valid SARIF structure', () => {
    const result = buildSarif({ checks: [] }, 'test.json');
    assert.equal(result.version, '2.1.0');
    assert.ok(result.runs);
    assert.equal(result.runs[0].tool.driver.name, 'bomprobe');
  });

  it('maps checks to rules and results', () => {
    const audit = {
      checks: [{
        id: 'component-license',
        name: 'Component License',
        severity: 'warning',
        findings: [{ message: 'missing license', component: 'lodash@4.17.21' }]
      }]
    };
    const sarif = buildSarif(audit, 'sbom.json');
    assert.equal(sarif.runs[0].tool.driver.rules.length, 1);
    assert.equal(sarif.runs[0].results.length, 1);
    assert.equal(sarif.runs[0].results[0].ruleId, 'component-license');
  });

  it('groups findings under same rule', () => {
    const audit = {
      checks: [{
        id: 'component-hash',
        severity: 'info',
        findings: [
          { message: 'no hash for a', component: 'a' },
          { message: 'no hash for b', component: 'b' }
        ]
      }]
    };
    const sarif = buildSarif(audit);
    assert.equal(sarif.runs[0].tool.driver.rules.length, 1);
    assert.equal(sarif.runs[0].results.length, 2);
  });

  it('handles empty checks', () => {
    const sarif = buildSarif({ checks: [{ id: 'x', findings: [] }] });
    assert.equal(sarif.runs[0].results.length, 0);
  });
});

describe('mapSeverityToLevel', () => {
  it('maps error to error', () => assert.equal(mapSeverityToLevel('error'), 'error'));
  it('maps warning to warning', () => assert.equal(mapSeverityToLevel('warning'), 'warning'));
  it('maps info to note', () => assert.equal(mapSeverityToLevel('info'), 'note'));
  it('maps critical to error', () => assert.equal(mapSeverityToLevel('critical'), 'error'));
  it('maps unknown to note', () => assert.equal(mapSeverityToLevel('xyz'), 'note'));
});
