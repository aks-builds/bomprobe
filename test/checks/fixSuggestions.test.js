const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { getSuggestion, getSuggestions, formatSuggestions } = require('../../src/checks/fixSuggestions');

describe('fix suggestions', () => {
  it('returns suggestion for known check id', () => {
    const s = getSuggestion('component-name');
    assert.ok(s);
    assert.ok(s.fix.length > 0);
    assert.ok(s.tool.length > 0);
  });

  it('returns null for unknown check id', () => {
    assert.equal(getSuggestion('nonexistent-check'), null);
  });

  it('returns multiple suggestions', () => {
    const s = getSuggestions(['component-name', 'component-version', 'fake']);
    assert.equal(Object.keys(s).length, 2);
    assert.ok(s['component-name']);
    assert.ok(s['component-version']);
  });

  it('formats suggestions from findings', () => {
    const findings = [
      { checkId: 'component-name', message: 'missing name' },
      { checkId: 'component-purl', message: 'missing purl' },
      { checkId: 'component-name', message: 'duplicate should be deduped' }
    ];
    const output = formatSuggestions(findings);
    assert.ok(output.includes('component-name'));
    assert.ok(output.includes('component-purl'));
    assert.ok(output.includes('Fix:'));
    assert.ok(output.includes('Tip:'));
  });

  it('returns empty string for no matching suggestions', () => {
    const output = formatSuggestions([{ checkId: 'unknown' }]);
    assert.equal(output, '');
  });
});
