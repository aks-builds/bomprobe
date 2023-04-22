const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatSarif } = require('../../src/output/sarif');

describe('SARIF output', () => {
  const result = {
    version: '0.1.0',
    results: [
      {
        id: 'component-name',
        name: 'Component Name',
        findings: [
          { severity: 'error', message: 'Component missing name', component: 'pkg:npm/unknown@1.0' },
          { severity: 'warning', message: 'Component has empty name' }
        ]
      },
      {
        id: 'component-version',
        name: 'Component Version',
        findings: [
          { severity: 'info', message: 'Component missing version' }
        ]
      }
    ]
  };

  it('produces valid SARIF structure', () => {
    const sarif = JSON.parse(formatSarif(result));
    assert.equal(sarif.version, '2.1.0');
    assert.ok(sarif.$schema.includes('sarif-schema'));
    assert.equal(sarif.runs.length, 1);
  });

  it('includes tool driver info', () => {
    const sarif = JSON.parse(formatSarif(result));
    const driver = sarif.runs[0].tool.driver;
    assert.equal(driver.name, 'bomprobe');
    assert.equal(driver.version, '0.1.0');
  });

  it('maps rules from checks', () => {
    const sarif = JSON.parse(formatSarif(result));
    const rules = sarif.runs[0].tool.driver.rules;
    assert.equal(rules.length, 2);
    assert.equal(rules[0].id, 'component-name');
  });

  it('maps findings to results', () => {
    const sarif = JSON.parse(formatSarif(result));
    assert.equal(sarif.runs[0].results.length, 3);
  });

  it('maps severity levels correctly', () => {
    const sarif = JSON.parse(formatSarif(result));
    const levels = sarif.runs[0].results.map(r => r.level);
    assert.ok(levels.includes('error'));
    assert.ok(levels.includes('warning'));
    assert.ok(levels.includes('note'));
  });

  it('includes component location when present', () => {
    const sarif = JSON.parse(formatSarif(result));
    const first = sarif.runs[0].results[0];
    assert.equal(first.locations.length, 1);
    assert.equal(first.locations[0].physicalLocation.artifactLocation.uri, 'pkg:npm/unknown@1.0');
  });

  it('handles empty results', () => {
    const sarif = JSON.parse(formatSarif({ results: [] }));
    assert.equal(sarif.runs[0].results.length, 0);
  });
});
