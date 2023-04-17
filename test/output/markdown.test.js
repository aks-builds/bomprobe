const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatMarkdown } = require('../../src/output/markdown');

describe('markdown output', () => {
  it('renders header with score and grade', () => {
    const result = { score: 85, grade: 'B', results: [] };
    const md = formatMarkdown(result);
    assert.ok(md.includes('85/100'));
    assert.ok(md.includes('(B)'));
  });

  it('renders findings table', () => {
    const result = {
      score: 70,
      grade: 'C',
      results: [{
        name: 'Component Version',
        findings: [{ severity: 'warning', message: 'Missing version for lodash' }]
      }]
    };
    const md = formatMarkdown(result);
    assert.ok(md.includes('| Component Version |'));
    assert.ok(md.includes('warning'));
    assert.ok(md.includes('Missing version'));
  });

  it('shows all passed when no findings', () => {
    const result = { score: 100, grade: 'A', results: [{ name: 'test', findings: [] }] };
    const md = formatMarkdown(result);
    assert.ok(md.includes('All checks passed'));
  });

  it('counts severity summary', () => {
    const result = {
      score: 60,
      grade: 'D',
      results: [
        { name: 'a', findings: [{ severity: 'error', message: 'err' }] },
        { name: 'b', findings: [{ severity: 'warning', message: 'warn' }, { severity: 'info', message: 'info' }] }
      ]
    };
    const md = formatMarkdown(result);
    assert.ok(md.includes('Errors: 1'));
    assert.ok(md.includes('Warnings: 1'));
    assert.ok(md.includes('Info: 1'));
  });

  it('handles object score shape', () => {
    const result = { score: { overall: 75 }, grade: 'C', results: [] };
    const md = formatMarkdown(result);
    assert.ok(md.includes('75/100'));
  });

  it('escapes pipe characters in messages', () => {
    const result = {
      score: 50,
      grade: 'F',
      results: [{ name: 'x', findings: [{ severity: 'info', message: 'a | b | c' }] }]
    };
    const md = formatMarkdown(result);
    assert.ok(md.includes('a \\| b \\| c'));
  });
});
