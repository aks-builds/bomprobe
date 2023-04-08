const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { classify, classifyComponents } = require('../../src/utils/licenseClassify');

describe('license classification', () => {
  it('classifies MIT as permissive', () => {
    assert.equal(classify('MIT'), 'permissive');
  });

  it('classifies GPL-3.0-only as copyleft', () => {
    assert.equal(classify('GPL-3.0-only'), 'copyleft');
  });

  it('classifies proprietary', () => {
    assert.equal(classify('proprietary-license'), 'proprietary');
  });

  it('returns unknown for null', () => {
    assert.equal(classify(null), 'unknown');
  });

  it('returns other for unrecognized', () => {
    assert.equal(classify('Custom-1.0'), 'other');
  });

  it('classifies components', () => {
    const components = [
      { licenses: [{ license: { id: 'MIT' } }] },
      { licenses: [{ license: { id: 'GPL-3.0-only' } }] },
      {}
    ];
    const counts = classifyComponents(components);
    assert.equal(counts.permissive, 1);
    assert.equal(counts.copyleft, 1);
    assert.equal(counts.unknown, 1);
  });
});
