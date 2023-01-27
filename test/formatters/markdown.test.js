const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatResult } = require('../../src/formatters/markdown');

describe('markdown formatter', () => {
  const baseResult = {
    file: 'test.json',
    format: 'cyclonedx',
    componentCount: 2,
    score: {
      overall: 7.5,
      components: { average: 8.0, scores: [10, 6], count: 2 },
      metadata: 10,
      dependencyCoverage: 5
    },
    checks: []
  };

  it('outputs markdown heading', () => {
    const output = formatResult(baseResult);
    assert.ok(output.startsWith('# bomprobe report'));
  });

  it('includes score table', () => {
    const output = formatResult(baseResult);
    assert.ok(output.includes('| Components | 8/10 |'));
  });

  it('shows issues table when findings exist', () => {
    const result = {
      ...baseResult,
      checks: [
        { findings: [{ severity: 'warning', message: 'missing purl' }] }
      ]
    };
    const output = formatResult(result);
    assert.ok(output.includes('## Issues'));
    assert.ok(output.includes('| WARNING | missing purl |'));
  });

  it('shows NTIA section when compliance is present', () => {
    const result = {
      ...baseResult,
      compliance: {
        compliant: true,
        summary: '7/7 checks passed',
        failed: []
      }
    };
    const output = formatResult(result);
    assert.ok(output.includes('## NTIA Compliance: PASS'));
  });
});
