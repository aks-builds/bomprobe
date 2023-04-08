const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { summarizeComponents } = require('../../src/utils/componentSummary');

describe('component summary', () => {
  it('counts types', () => {
    const components = [
      { type: 'library' },
      { type: 'library' },
      { type: 'framework' }
    ];
    const summary = summarizeComponents(components);
    assert.equal(summary.types.library, 2);
    assert.equal(summary.types.framework, 1);
  });

  it('calculates coverage ratios', () => {
    const components = [
      { purl: 'pkg:npm/a', license: 'MIT', version: '1.0', supplier: 'x', hashes: 1 },
      { purl: null, license: null, version: null, supplier: null, hashes: 0 }
    ];
    const summary = summarizeComponents(components);
    assert.equal(summary.coverage.purl, 0.5);
    assert.equal(summary.coverage.license, 0.5);
  });

  it('handles empty list', () => {
    const summary = summarizeComponents([]);
    assert.equal(summary.total, 0);
    assert.equal(summary.coverage.purl, 0);
  });

  it('defaults unknown type and unspecified scope', () => {
    const summary = summarizeComponents([{ name: 'a' }]);
    assert.equal(summary.types.unknown, 1);
    assert.equal(summary.scopes.unspecified, 1);
  });
});
