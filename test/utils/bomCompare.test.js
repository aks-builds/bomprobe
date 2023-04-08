const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { compareComponents, compareSummary } = require('../../src/utils/bomCompare');

describe('BOM comparison', () => {
  const before = [
    { name: 'lodash', version: '4.17.20', purl: 'pkg:npm/lodash' },
    { name: 'express', version: '4.17.1', purl: 'pkg:npm/express' },
    { name: 'old-lib', version: '1.0.0', purl: 'pkg:npm/old-lib' }
  ];
  const after = [
    { name: 'lodash', version: '4.17.21', purl: 'pkg:npm/lodash' },
    { name: 'express', version: '4.17.1', purl: 'pkg:npm/express' },
    { name: 'new-lib', version: '1.0.0', purl: 'pkg:npm/new-lib' }
  ];

  it('detects added components', () => {
    const diff = compareComponents(before, after);
    assert.equal(diff.added.length, 1);
    assert.equal(diff.added[0].name, 'new-lib');
  });

  it('detects removed components', () => {
    const diff = compareComponents(before, after);
    assert.equal(diff.removed.length, 1);
    assert.equal(diff.removed[0].name, 'old-lib');
  });

  it('detects version changes', () => {
    const diff = compareComponents(before, after);
    assert.equal(diff.versionChanged.length, 1);
    assert.equal(diff.versionChanged[0].from, '4.17.20');
    assert.equal(diff.versionChanged[0].to, '4.17.21');
  });

  it('detects unchanged', () => {
    const diff = compareComponents(before, after);
    assert.equal(diff.unchanged.length, 1);
  });

  it('produces summary', () => {
    const diff = compareComponents(before, after);
    const summary = compareSummary(diff);
    assert.equal(summary.addedCount, 1);
    assert.equal(summary.removedCount, 1);
    assert.equal(summary.totalDelta, 0);
  });
});
