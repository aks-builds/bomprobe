const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { analyzeScopes, findDevDependencies } = require('../../src/utils/scopeAnalysis');

describe('scope analysis', () => {
  it('counts scope categories', () => {
    const components = [
      { scope: 'required' },
      { scope: 'optional' },
      { scope: 'excluded' },
      {}
    ];
    const result = analyzeScopes(components);
    assert.equal(result.required, 1);
    assert.equal(result.optional, 1);
    assert.equal(result.excluded, 1);
    assert.equal(result.unspecified, 1);
    assert.equal(result.total, 4);
  });

  it('calculates coverage percentage', () => {
    const components = [{ scope: 'required' }, { scope: 'required' }, {}];
    assert.equal(analyzeScopes(components).coverage, 67);
  });

  it('handles empty list', () => {
    assert.equal(analyzeScopes([]).coverage, 0);
  });

  it('finds dev dependencies', () => {
    const components = [
      { name: 'a', scope: 'required' },
      { name: 'b', scope: 'optional' },
      { name: 'c', scope: 'excluded' }
    ];
    const devDeps = findDevDependencies(components);
    assert.equal(devDeps.length, 2);
  });
});
