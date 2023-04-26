const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatHtml } = require('../../src/output/htmlReport');

describe('HTML report', () => {
  const result = {
    score: { overall: 85, grade: 'B' },
    checks: [
      { id: 'check-a', name: 'Check A', findings: [
        { severity: 'error', message: 'Missing field' },
        { severity: 'warning', message: 'No version' }
      ]},
      { id: 'check-b', name: 'Check B', findings: [] }
    ]
  };

  it('produces valid HTML structure', () => {
    const html = formatHtml(result);
    assert.ok(html.includes('<!DOCTYPE html>'));
    assert.ok(html.includes('</html>'));
  });

  it('shows grade and score', () => {
    const html = formatHtml(result);
    assert.ok(html.includes('>B<'));
    assert.ok(html.includes('>85<'));
  });

  it('renders findings as table rows', () => {
    const html = formatHtml(result);
    assert.ok(html.includes('Missing field'));
    assert.ok(html.includes('No version'));
  });

  it('applies severity badges', () => {
    const html = formatHtml(result);
    assert.ok(html.includes('badge error'));
    assert.ok(html.includes('badge warning'));
  });

  it('escapes HTML entities', () => {
    const r = { checks: [{ id: 'x', name: 'X', findings: [{ severity: 'error', message: '<script>alert(1)</script>' }] }] };
    const html = formatHtml(r);
    assert.ok(html.includes('&lt;script&gt;'));
    assert.ok(!html.includes('<script>alert'));
  });

  it('shows no-findings message', () => {
    const html = formatHtml({ checks: [] });
    assert.ok(html.includes('No findings'));
  });
});
