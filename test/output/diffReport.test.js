const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatDiffText, formatDiffJson } = require('../../src/output/diffReport');

describe('diff report output', () => {
  const before = {
    components: [
      { name: 'lodash', version: '4.17.21', purl: 'pkg:npm/lodash@4.17.21' },
      { name: 'express', version: '4.17.1' },
      { name: 'old-lib', version: '1.0.0' }
    ]
  };

  const after = {
    components: [
      { name: 'lodash', version: '4.17.21', purl: 'pkg:npm/lodash@4.17.21', type: 'library' },
      { name: 'express', version: '4.17.1' },
      { name: 'new-dep', version: '2.0.0' }
    ]
  };

  it('formats text diff with counts', () => {
    const text = formatDiffText(before, after);
    assert.ok(text.includes('SBOM Diff Report'));
    assert.ok(text.includes('Added: 1'));
    assert.ok(text.includes('Removed: 1'));
    assert.ok(text.includes('+ new-dep'));
    assert.ok(text.includes('- old-lib'));
  });

  it('shows changed component details', () => {
    const text = formatDiffText(before, after);
    assert.ok(text.includes('~ lodash'));
    assert.ok(text.includes('type'));
  });

  it('formats JSON diff', () => {
    const json = JSON.parse(formatDiffJson(before, after));
    assert.equal(json.summary.added, 1);
    assert.equal(json.summary.removed, 1);
    assert.equal(json.summary.changed, 1);
    assert.equal(json.summary.unchanged, 1);
  });

  it('handles identical SBOMs', () => {
    const text = formatDiffText(before, before);
    assert.ok(text.includes('Added: 0'));
    assert.ok(text.includes('Removed: 0'));
  });

  it('handles empty SBOMs', () => {
    const text = formatDiffText({ components: [] }, { components: [] });
    assert.ok(text.includes('Unchanged: 0'));
  });
});
