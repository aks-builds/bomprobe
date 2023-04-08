const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { isKnownType, categorizeType, KNOWN_TYPES } = require('../../src/utils/purlRegistry');

describe('PURL registry', () => {
  it('recognizes npm as known', () => {
    assert.ok(isKnownType('npm'));
  });

  it('rejects unknown type', () => {
    assert.ok(!isKnownType('invented'));
  });

  it('categorizes language packages', () => {
    assert.equal(categorizeType('npm'), 'language');
    assert.equal(categorizeType('pypi'), 'language');
    assert.equal(categorizeType('maven'), 'language');
  });

  it('categorizes container packages', () => {
    assert.equal(categorizeType('docker'), 'container');
    assert.equal(categorizeType('oci'), 'container');
  });

  it('categorizes OS packages', () => {
    assert.equal(categorizeType('deb'), 'os');
  });

  it('returns unknown for unrecognized type', () => {
    assert.equal(categorizeType('invented'), 'unknown');
  });

  it('exports sufficient known types', () => {
    assert.ok(KNOWN_TYPES.length >= 20);
  });
});
