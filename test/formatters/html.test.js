const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatResult } = require('../../src/formatters/html');

describe('html formatter', () => {
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

  it('outputs valid HTML', () => {
    const output = formatResult(result);
    assert.ok(output.includes('<!DOCTYPE html>'));
    assert.ok(output.includes('</html>'));
  });

  it('includes score', () => {
    const output = formatResult(result);
    assert.ok(output.includes('6/10'));
  });

  it('includes findings table', () => {
    const output = formatResult(result);
    assert.ok(output.includes('<table>'));
    assert.ok(output.includes('missing version'));
  });

  it('shows no-findings message for clean SBOMs', () => {
    const clean = { ...result, checks: [{ id: 'a', name: 'A', findings: [] }] };
    const output = formatResult(clean);
    assert.ok(output.includes('looks great'));
  });

  it('uses green color for high scores', () => {
    const high = { ...result, score: { overall: 9.0 } };
    const output = formatResult(high);
    assert.ok(output.includes('#2d7d46'));
  });
});
