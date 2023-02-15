const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatResult } = require('../../src/formatters/summary');

describe('summary formatter', () => {
  const result = {
    file: 'test.json',
    format: 'cyclonedx',
    score: { overall: 7.5 },
    componentCount: 3,
    checks: [
      { id: 'a', findings: [{ severity: 'error', message: 'x' }] },
      { id: 'b', findings: [{ severity: 'warning', message: 'y' }, { severity: 'info', message: 'z' }] }
    ]
  };

  it('outputs a single line', () => {
    const output = formatResult(result);
    assert.ok(!output.includes('\n'));
  });

  it('includes score', () => {
    const output = formatResult(result);
    assert.ok(output.includes('score=7.5/10'));
  });

  it('includes counts', () => {
    const output = formatResult(result);
    assert.ok(output.includes('errors=1'));
    assert.ok(output.includes('warnings=1'));
    assert.ok(output.includes('info=1'));
  });

  it('includes NTIA status when present', () => {
    const withNtia = { ...result, compliance: { compliant: true } };
    const output = formatResult(withNtia);
    assert.ok(output.includes('ntia=pass'));
  });
});
