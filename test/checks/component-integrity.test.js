const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const check = require('../../src/checks/component-integrity');

describe('component-integrity check', () => {
  it('passes strong hash algorithms', () => {
    const sbom = { components: [
      { name: 'a', hashes: [{ alg: 'SHA-256', content: 'abc' }] }
    ]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('flags weak-only hashes', () => {
    const sbom = { components: [
      { name: 'a', hashes: [{ alg: 'MD5', content: 'abc' }] }
    ]};
    assert.equal(check.run(sbom).length, 1);
    assert.ok(check.run(sbom)[0].message.includes('weak'));
  });

  it('passes mixed strong and weak', () => {
    const sbom = { components: [
      { name: 'a', hashes: [
        { alg: 'MD5', content: 'abc' },
        { alg: 'SHA-256', content: 'def' }
      ]}
    ]};
    assert.equal(check.run(sbom).length, 0);
  });

  it('skips components without hashes', () => {
    assert.equal(check.run({ components: [{ name: 'a' }] }).length, 0);
  });
});
