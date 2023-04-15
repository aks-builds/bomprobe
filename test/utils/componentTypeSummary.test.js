const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { summarizeTypes, KNOWN_TYPES } = require('../../src/utils/componentTypeSummary');

describe('component type summary', () => {
  it('counts types', () => {
    const components = [
      { type: 'library' },
      { type: 'library' },
      { type: 'framework' },
      { type: 'application' }
    ];
    const summary = summarizeTypes(components);
    assert.equal(summary.total, 4);
    assert.equal(summary.types[0].type, 'library');
    assert.equal(summary.types[0].count, 2);
  });

  it('sorts by count descending', () => {
    const components = [
      { type: 'framework' },
      { type: 'library' },
      { type: 'library' },
      { type: 'library' }
    ];
    const summary = summarizeTypes(components);
    assert.equal(summary.types[0].type, 'library');
  });

  it('tracks unknown types', () => {
    const components = [{ type: 'custom-thing' }];
    const summary = summarizeTypes(components);
    assert.equal(summary.unknown, 1);
  });

  it('handles missing type', () => {
    const components = [{}];
    const summary = summarizeTypes(components);
    assert.equal(summary.types[0].type, 'unspecified');
    assert.equal(summary.unknown, 1);
  });

  it('calculates percentage', () => {
    const components = [{ type: 'library' }, { type: 'library' }, { type: 'framework' }, { type: 'framework' }];
    const summary = summarizeTypes(components);
    assert.equal(summary.types[0].pct, 50);
  });

  it('knows CycloneDX component types', () => {
    assert.ok(KNOWN_TYPES.has('library'));
    assert.ok(KNOWN_TYPES.has('firmware'));
    assert.ok(KNOWN_TYPES.has('machine-learning-model'));
  });
});
