const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatResult } = require('../../src/formatters/text');

describe('text formatter', () => {
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

  it('includes file name and format', () => {
    const output = formatResult(baseResult);
    assert.ok(output.includes('test.json'));
    assert.ok(output.includes('cyclonedx'));
  });

  it('shows score bar', () => {
    const output = formatResult(baseResult);
    assert.ok(output.includes('7.5/10'));
  });

  it('shows no issues when checks are clean', () => {
    const output = formatResult(baseResult);
    assert.ok(output.includes('No issues found'));
  });

  it('lists findings with severity', () => {
    const result = {
      ...baseResult,
      checks: [
        { findings: [{ severity: 'warning', message: 'missing version' }] }
      ]
    };
    const output = formatResult(result);
    assert.ok(output.includes('[WRN]'));
    assert.ok(output.includes('missing version'));
  });

  it('shows NTIA compliance when present', () => {
    const result = {
      ...baseResult,
      compliance: {
        compliant: false,
        summary: '5/7 checks passed',
        failed: [{ id: 'component-purl', reason: 'missing purl' }]
      }
    };
    const output = formatResult(result);
    assert.ok(output.includes('NTIA Compliance: FAIL'));
    assert.ok(output.includes('5/7'));
  });
});
