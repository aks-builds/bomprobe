const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { analyzeExternalRefs, KNOWN_REF_TYPES } = require('../../src/utils/externalRefAnalysis');

describe('external reference analysis', () => {
  it('counts components with refs', () => {
    const components = [
      { externalReferences: [{ type: 'vcs', url: 'https://github.com/a' }] },
      {}
    ];
    const result = analyzeExternalRefs(components);
    assert.equal(result.withRefs, 1);
    assert.equal(result.withoutRefs, 1);
    assert.equal(result.coverage, 50);
  });

  it('counts ref types', () => {
    const components = [
      { externalReferences: [
        { type: 'vcs', url: 'a' },
        { type: 'website', url: 'b' }
      ]}
    ];
    const result = analyzeExternalRefs(components);
    assert.equal(result.typeCounts.vcs, 1);
    assert.equal(result.typeCounts.website, 1);
    assert.equal(result.totalRefs, 2);
  });

  it('handles empty list', () => {
    assert.equal(analyzeExternalRefs([]).coverage, 0);
  });

  it('has known reference types', () => {
    assert.ok(KNOWN_REF_TYPES.has('vcs'));
    assert.ok(KNOWN_REF_TYPES.has('advisories'));
    assert.ok(KNOWN_REF_TYPES.size > 20);
  });
});
