const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { categorizeHash, analyzeHashes } = require('../../src/utils/hashVerify');

describe('hash verification', () => {
  it('categorizes SHA-256 as strong', () => {
    assert.equal(categorizeHash('SHA-256'), 'strong');
  });

  it('categorizes MD5 as weak', () => {
    assert.equal(categorizeHash('MD5'), 'weak');
  });

  it('categorizes SHA-1 as weak', () => {
    assert.equal(categorizeHash('SHA-1'), 'weak');
  });

  it('returns unknown for unrecognized', () => {
    assert.equal(categorizeHash('CUSTOM'), 'unknown');
  });

  it('analyzes components hash coverage', () => {
    const components = [
      { hashes: [{ alg: 'SHA-256', content: 'abc' }] },
      { hashes: [{ alg: 'MD5', content: 'def' }] },
      {}
    ];
    const result = analyzeHashes(components);
    assert.equal(result.withStrongHash, 1);
    assert.equal(result.withWeakOnly, 1);
    assert.equal(result.noHash, 1);
  });
});
