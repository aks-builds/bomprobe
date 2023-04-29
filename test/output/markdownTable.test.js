const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { findingsToMarkdownTable, summaryToMarkdownTable } = require('../../src/output/markdownTable');

describe('markdown table output', () => {
  it('formats findings as table', () => {
    const findings = [{ severity: 'error', checkId: 'comp-name', component: 'lodash', message: 'missing' }];
    const md = findingsToMarkdownTable(findings);
    assert.ok(md.includes('| error |'));
    assert.ok(md.includes('lodash'));
  });

  it('returns no findings message', () => {
    assert.equal(findingsToMarkdownTable([]), 'No findings.');
  });

  it('escapes pipe chars', () => {
    const findings = [{ severity: 'info', checkId: 'x', component: 'a|b', message: 'has pipe' }];
    const md = findingsToMarkdownTable(findings);
    assert.ok(md.includes('a\\|b'));
  });

  it('formats summary table', () => {
    const md = summaryToMarkdownTable({ score: 85, grade: 'B', checks: 109 });
    assert.ok(md.includes('| score | 85 |'));
    assert.ok(md.includes('| grade | B |'));
  });

  it('handles empty summary', () => {
    const md = summaryToMarkdownTable({});
    assert.ok(md.includes('Metric'));
    assert.ok(!md.includes('| |'));
  });
});
