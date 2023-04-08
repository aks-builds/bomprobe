const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { normalizeComponent, normalizeAll } = require('../../src/utils/normalize');

describe('component normalization', () => {
  it('lowercases name', () => {
    assert.equal(normalizeComponent({ name: 'Lodash' }).name, 'lodash');
  });

  it('defaults type to library', () => {
    assert.equal(normalizeComponent({ name: 'a' }).type, 'library');
  });

  it('defaults scope to required', () => {
    assert.equal(normalizeComponent({ name: 'a' }).scope, 'required');
  });

  it('extracts string license', () => {
    assert.equal(normalizeComponent({ name: 'a', license: 'MIT' }).license, 'MIT');
  });

  it('extracts object license id', () => {
    assert.equal(normalizeComponent({ name: 'a', license: { id: 'Apache-2.0' } }).license, 'Apache-2.0');
  });

  it('extracts expression license', () => {
    assert.equal(normalizeComponent({ name: 'a', license: { expression: 'MIT OR Apache-2.0' } }).license, 'MIT OR Apache-2.0');
  });

  it('extracts supplier name from object', () => {
    assert.equal(normalizeComponent({ name: 'a', supplier: { name: 'Acme' } }).supplier, 'Acme');
  });

  it('normalizes all components', () => {
    const result = normalizeAll([{ name: 'A' }, { name: 'B' }]);
    assert.equal(result.length, 2);
    assert.equal(result[0].name, 'a');
  });
});
