const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { matchPattern, createFilter, filterComponents } = require('../../src/utils/ignore');

describe('ignore pattern utilities', () => {
  it('matches exact name', () => {
    assert.ok(matchPattern('lodash', 'lodash'));
    assert.ok(!matchPattern('lodash', 'express'));
  });

  it('matches prefix wildcard', () => {
    assert.ok(matchPattern('lodash.merge', '*.merge'));
    assert.ok(!matchPattern('lodash', '*.merge'));
  });

  it('matches suffix wildcard', () => {
    assert.ok(matchPattern('lodash.merge', 'lodash*'));
    assert.ok(!matchPattern('express', 'lodash*'));
  });

  it('matches contains wildcard', () => {
    assert.ok(matchPattern('my-lodash-fork', '*lodash*'));
    assert.ok(!matchPattern('express', '*lodash*'));
  });

  it('creates a filter from patterns', () => {
    const filter = createFilter(['lodash', '@types/*']);
    assert.ok(filter({ name: 'express' }));
    assert.ok(!filter({ name: 'lodash' }));
    assert.ok(!filter({ name: '@types/node' }));
  });

  it('filters components by ignore list', () => {
    const components = [
      { name: 'express' },
      { name: 'lodash' },
      { name: '@types/node' }
    ];
    const result = filterComponents(components, ['lodash']);
    assert.equal(result.length, 2);
  });

  it('returns all when no patterns', () => {
    const result = filterComponents([{ name: 'a' }], []);
    assert.equal(result.length, 1);
  });
});
