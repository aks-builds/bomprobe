const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { merge } = require('../src/merger');

const fixtures = path.join(__dirname, 'fixtures');

describe('merge', () => {
  it('merges multiple SBOM audits', () => {
    const result = merge([
      path.join(fixtures, 'minimal-cdx.json'),
      path.join(fixtures, 'minimal-spdx.json')
    ]);
    assert.equal(result.summary.total, 2);
    assert.equal(result.summary.valid, 2);
    assert.equal(result.summary.errors, 0);
    assert.ok(result.summary.averageScore >= 0);
  });

  it('reports errors for bad files', () => {
    const result = merge([
      path.join(fixtures, 'minimal-cdx.json'),
      path.join(fixtures, 'nonexistent.json')
    ]);
    assert.equal(result.summary.total, 2);
    assert.equal(result.summary.valid, 1);
    assert.equal(result.summary.errors, 1);
  });

  it('calculates total components', () => {
    const result = merge([
      path.join(fixtures, 'perfect-cdx.json'),
      path.join(fixtures, 'perfect-spdx.json')
    ]);
    assert.ok(result.summary.totalComponents >= 2);
  });

  it('handles empty file list', () => {
    const result = merge([]);
    assert.equal(result.summary.total, 0);
    assert.equal(result.summary.averageScore, 0);
  });
});
