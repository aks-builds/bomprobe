const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatDiffText, formatDiffJson, formatDiffMarkdown } = require('../../src/diff/formatter');

const sampleDiff = {
  summary: { beforeCount: 3, afterCount: 4, added: 2, removed: 1, modified: 1, unchanged: 1 },
  components: {
    added: [{ name: 'new-pkg', version: '1.0.0' }, { name: 'fresh', version: '0.1.0' }],
    removed: [{ name: 'old-pkg', version: '0.9.0' }],
    modified: [{ component: { name: 'mod-pkg', version: '2.0.0' }, changes: [{ field: 'type', before: 'library', after: 'framework' }] }],
    unchanged: [{ name: 'stable', version: '1.0.0' }]
  },
  metadata: [{ field: 'timestamp', before: '2023-01-01', after: '2023-06-01' }]
};

describe('formatDiffText', () => {
  it('includes summary counts', () => {
    const out = formatDiffText(sampleDiff);
    assert.ok(out.includes('+2'));
    assert.ok(out.includes('-1'));
  });

  it('lists added components with + prefix', () => {
    const out = formatDiffText(sampleDiff);
    assert.ok(out.includes('+ new-pkg@1.0.0'));
  });

  it('lists removed components with - prefix', () => {
    const out = formatDiffText(sampleDiff);
    assert.ok(out.includes('- old-pkg@0.9.0'));
  });

  it('lists modified components with ~ prefix', () => {
    const out = formatDiffText(sampleDiff);
    assert.ok(out.includes('~ mod-pkg@2.0.0'));
  });
});

describe('formatDiffJson', () => {
  it('returns valid JSON', () => {
    const out = formatDiffJson(sampleDiff);
    const parsed = JSON.parse(out);
    assert.equal(parsed.summary.added, 2);
  });
});

describe('formatDiffMarkdown', () => {
  it('includes markdown table', () => {
    const out = formatDiffMarkdown(sampleDiff);
    assert.ok(out.includes('| Added | +2 |'));
  });

  it('uses code formatting for package names', () => {
    const out = formatDiffMarkdown(sampleDiff);
    assert.ok(out.includes('`new-pkg@1.0.0`'));
  });
});
