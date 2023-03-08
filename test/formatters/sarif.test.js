const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatResult } = require('../../src/formatters/sarif');

describe('sarif formatter', () => {
  const result = {
    file: 'sbom.json',
    format: 'cyclonedx',
    score: { overall: 6.0 },
    componentCount: 2,
    checks: [
      { id: 'component-name', name: 'Component Name', findings: [] },
      {
        id: 'component-version',
        name: 'Component Version',
        findings: [{ severity: 'warning', component: 'x', message: 'missing version' }]
      }
    ]
  };

  it('outputs valid JSON', () => {
    const output = formatResult(result);
    const parsed = JSON.parse(output);
    assert.ok(parsed);
  });

  it('follows SARIF 2.1.0 schema', () => {
    const parsed = JSON.parse(formatResult(result));
    assert.equal(parsed.version, '2.1.0');
    assert.ok(parsed.$schema.includes('sarif'));
  });

  it('includes tool driver info', () => {
    const parsed = JSON.parse(formatResult(result));
    assert.equal(parsed.runs[0].tool.driver.name, 'bomprobe');
  });

  it('maps findings to results', () => {
    const parsed = JSON.parse(formatResult(result));
    assert.equal(parsed.runs[0].results.length, 1);
    assert.equal(parsed.runs[0].results[0].ruleId, 'component-version');
    assert.equal(parsed.runs[0].results[0].level, 'warning');
  });

  it('maps severity to SARIF levels', () => {
    const r = {
      ...result,
      checks: [
        { id: 'a', name: 'A', findings: [{ severity: 'error', message: 'e' }] },
        { id: 'b', name: 'B', findings: [{ severity: 'info', message: 'i' }] }
      ]
    };
    const parsed = JSON.parse(formatResult(r));
    const levels = parsed.runs[0].results.map(x => x.level);
    assert.ok(levels.includes('error'));
    assert.ok(levels.includes('note'));
  });
});
