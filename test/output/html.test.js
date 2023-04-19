const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatHtml } = require('../../src/output/html');

describe('html output', () => {
  it('renders valid HTML structure', () => {
    const result = { score: 90, grade: 'A', results: [] };
    const html = formatHtml(result);
    assert.ok(html.includes('<!doctype html>'));
    assert.ok(html.includes('</html>'));
  });

  it('renders score and grade', () => {
    const result = { score: 75, grade: 'C', results: [] };
    const html = formatHtml(result);
    assert.ok(html.includes('75/100'));
    assert.ok(html.includes('>C<'));
  });

  it('renders findings table', () => {
    const result = {
      score: 60,
      grade: 'D',
      results: [{
        name: 'Component Version',
        findings: [{ severity: 'warning', component: 'lodash', message: 'Missing version' }]
      }]
    };
    const html = formatHtml(result);
    assert.ok(html.includes('<table>'));
    assert.ok(html.includes('Component Version'));
    assert.ok(html.includes('warning'));
  });

  it('shows all passed when no findings', () => {
    const result = { score: 100, grade: 'A', results: [{ name: 'test', findings: [] }] };
    const html = formatHtml(result);
    assert.ok(html.includes('All checks passed'));
  });

  it('escapes HTML in messages', () => {
    const result = {
      score: 50,
      grade: 'F',
      results: [{ name: 'x', findings: [{ severity: 'info', message: '<script>alert(1)</script>' }] }]
    };
    const html = formatHtml(result);
    assert.ok(html.includes('&lt;script&gt;'));
    assert.ok(!html.includes('<script>alert'));
  });

  it('handles object score shape', () => {
    const result = { score: { overall: 82 }, grade: 'B', results: [] };
    const html = formatHtml(result);
    assert.ok(html.includes('82/100'));
  });

  it('applies severity CSS classes', () => {
    const result = {
      score: 50,
      grade: 'F',
      results: [
        { name: 'a', findings: [{ severity: 'error', message: 'err' }] },
        { name: 'b', findings: [{ severity: 'warning', message: 'warn' }] }
      ]
    };
    const html = formatHtml(result);
    assert.ok(html.includes('class="err"'));
    assert.ok(html.includes('class="warn"'));
  });
});
