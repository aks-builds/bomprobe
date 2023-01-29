const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatResult } = require('../../src/formatters/json');

describe('json formatter', () => {
  it('returns valid JSON string', () => {
    const result = { score: { overall: 7 }, checks: [] };
    const output = formatResult(result);
    const parsed = JSON.parse(output);
    assert.equal(parsed.score.overall, 7);
  });

  it('pretty-prints with indentation', () => {
    const result = { score: { overall: 7 } };
    const output = formatResult(result);
    assert.ok(output.includes('\n'));
    assert.ok(output.includes('  '));
  });
});
