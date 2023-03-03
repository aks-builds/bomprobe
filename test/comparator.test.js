const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { compare } = require('../src/comparator');

const fixtures = path.join(__dirname, 'fixtures');

describe('comparator', () => {
  it('detects identical SBOMs', () => {
    const result = compare(
      path.join(fixtures, 'minimal-cdx.json'),
      path.join(fixtures, 'minimal-cdx.json')
    );
    assert.equal(result.added.length, 0);
    assert.equal(result.removed.length, 0);
    assert.equal(result.versionChanges.length, 0);
  });

  it('detects added and removed components', () => {
    const result = compare(
      path.join(fixtures, 'minimal-cdx.json'),
      path.join(fixtures, 'cdx-1.4.json')
    );
    assert.ok(result.added.length > 0 || result.removed.length > 0);
  });

  it('compares across formats', () => {
    const result = compare(
      path.join(fixtures, 'minimal-cdx.json'),
      path.join(fixtures, 'minimal-spdx.json')
    );
    assert.equal(result.formatA, 'cyclonedx');
    assert.equal(result.formatB, 'spdx');
  });

  it('reports error for missing file', () => {
    const result = compare('/no/file.json', path.join(fixtures, 'minimal-cdx.json'));
    assert.ok(result.error);
  });

  it('includes component counts', () => {
    const result = compare(
      path.join(fixtures, 'minimal-cdx.json'),
      path.join(fixtures, 'perfect-cdx.json')
    );
    assert.ok(result.componentCountA >= 0);
    assert.ok(result.componentCountB >= 0);
  });
});
