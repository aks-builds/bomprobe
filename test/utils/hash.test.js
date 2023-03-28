const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { hashFile, hashString } = require('../../src/utils/hash');

describe('hash utilities', () => {
  it('hashes a string with sha256', () => {
    const h = hashString('hello');
    assert.equal(h.length, 64);
    assert.equal(h, '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  it('hashes a string with md5', () => {
    const h = hashString('hello', 'md5');
    assert.equal(h.length, 32);
  });

  it('hashes a file', () => {
    const fixture = path.join(__dirname, '..', 'fixtures', 'minimal-cdx.json');
    const h = hashFile(fixture);
    assert.equal(h.length, 64);
    assert.equal(typeof h, 'string');
  });

  it('produces consistent results', () => {
    const a = hashString('test');
    const b = hashString('test');
    assert.equal(a, b);
  });
});
