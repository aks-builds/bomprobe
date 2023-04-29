const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { scoreBadge, gradeBadge, formatBadgeMarkdown } = require('../../src/output/badgeGenerator');

describe('badge generator', () => {
  it('generates green score badge for 85', () => {
    const url = scoreBadge(85);
    assert.ok(url.includes('brightgreen'));
    assert.ok(url.includes('85'));
  });

  it('generates red score badge for 15', () => {
    const url = scoreBadge(15);
    assert.ok(url.includes('red'));
  });

  it('generates yellow score badge for 50', () => {
    const url = scoreBadge(50);
    assert.ok(url.includes('yellow'));
  });

  it('generates grade badge', () => {
    const url = gradeBadge('A');
    assert.ok(url.includes('brightgreen'));
    assert.ok(url.includes('grade'));
  });

  it('formats markdown with both badges', () => {
    const md = formatBadgeMarkdown(85, 'A');
    assert.ok(md.includes('![bomprobe score]'));
    assert.ok(md.includes('![bomprobe grade]'));
  });

  it('handles unknown grade', () => {
    const url = gradeBadge('X');
    assert.ok(url.includes('lightgrey'));
  });
});
