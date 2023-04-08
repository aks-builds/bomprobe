const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { mergeConfig, resolveConfig } = require('../../src/utils/configMerge');

describe('config merge', () => {
  it('merges simple values', () => {
    const result = mergeConfig({ a: 1 }, { b: 2 });
    assert.deepEqual(result, { a: 1, b: 2 });
  });

  it('later values override', () => {
    const result = mergeConfig({ a: 1 }, { a: 2 });
    assert.equal(result.a, 2);
  });

  it('merges arrays', () => {
    const result = mergeConfig({ items: [1] }, { items: [2] });
    assert.deepEqual(result.items, [1, 2]);
  });

  it('deep merges objects', () => {
    const result = mergeConfig({ nested: { a: 1 } }, { nested: { b: 2 } });
    assert.deepEqual(result.nested, { a: 1, b: 2 });
  });

  it('resolves config with defaults', () => {
    const result = resolveConfig({ format: 'json' }, { failOn: 'warning' });
    assert.equal(result.format, 'json');
    assert.equal(result.failOn, 'warning');
    assert.deepEqual(result.exclude, []);
  });

  it('CLI flags override file config', () => {
    const result = resolveConfig({ format: 'json' }, { format: 'text' });
    assert.equal(result.format, 'text');
  });
});
